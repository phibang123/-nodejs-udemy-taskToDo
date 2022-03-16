const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const { sendWellcomeEmail, sendCancelationEmail} = require("../emails/account")
const Users = require("../models/users.model");
const sharp = require("sharp")

router.get("/tests", (req, res) => {
	res.send("This is from my other router");
});

router.post("/users", async (req, res) => {
	const user = new Users(req.body);

	try {
		await user.save();
		sendWellcomeEmail(user.email, user.name)
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}

	//  user.save().then((user) =>
	// {
	//  res.status(201).send(user)
	// }).catch((error) =>
	// {
	//   res.status(400).send(error)
	// })
});

router.get("/users", auth, async (req, res) => {
	try {
		const users = await Users.find();
		res.status(200).send(users);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/users/me", auth, async (req, res) => {
	console.log(req.user.populate("tasks"), "alo");
	res.status(200).send(req.user);
});

router.get("/users/:id", async (req, res) => {
	const _id = req.params.id;

	try {
		const user = await Users.findById({ _id });
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
	// Users.findById({_id}).then((user) => {
	//   if (!user)
	//   {
	//     return res.status(404).send()
	//   }
	//   res.send(user)
	// }).catch((e) =>
	// {
	//   res.status(500).send(e)
	// })
});

router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	console.log(typeof updates);
	const allowedUpdates = ["name", "email", "password", "age"];
	const isValiOperetion = updates.every((update) => {
		return allowedUpdates.includes(update);
	});
	if (!isValiOperetion) {
		return res.status(400).send({
			error: "dmm",
		});
	}
	try {
		//new true trả về field đã cập nhập
		//validator trước khi cập nhập
		// const user = await Users.findByIdAndUpdate( req.params.id,
		//   req.body, {new: true, runValidators: true}
		// )

		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.status(200).send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		// const user = await Users.findByIdAndDelete(req.user._id)
		// if (!user)
		// {
		//   return user.status(404).send()
		// }
		await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name)
		res.send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await Users.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		console.log(token);
		res.send({ user: user, token });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		console.log(req.token);
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();

		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		console.log(req.token);
		req.user.tokens = [];
		await req.user.save();

		res.send();
	} catch (error) {
		res.status(500).send();
	}
});

const multer = require("multer");
const User = require("../models/users.model");
const upload = multer({
	limits: {
		fileSize: 2500000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Please upload a Images"));
		}
		cb(undefined, true);
	},
});

router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
  async (req, res) =>
  {
    //sharp nó sẽ tự động di9eu chinh hình ảnh thèo chiều dài rộng mà vận giựa khuôn mặt trung tâm
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
    try
    {
      req.user.avatar = buffer

			//req.user.avatar = req.file.buffer;
			//lưu file buffe vào database
			//image/jpg có thể đổi qua cái khác nếu bạn ảnh khác
			//bên fron-end thì src = "data:image/jpg;base64,{{buffer}}"
			await req.user.save();
			res.send();
		} catch (error) {}
	},
	(error, req, res, next) => {
		console.log(error);
		res.status(400).send({ error: error.message });
	}
);

router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await Users.findById(req.params.id);
		console.log(user.email);
		if (!user || !user.avatar) {
			console.log(123);
			throw new Error();
		}
		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
});

module.exports = router;
