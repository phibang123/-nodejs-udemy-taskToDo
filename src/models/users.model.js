const mongoose = require("mongoose");
const validator = require("validator");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Tasks = require("./task.model");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			require: true,
		},
		age: {
			type: Number,
			trim: true,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error("Age con cu gì vậy");
				}
			},
		},

		email: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("email invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Erorr("Password cannot contain  'password'");
				}
			},
		},
		tokens: [
			{
				//ở đây nó sẽ tự động tạo ra _id vì cái này là mãng
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer
		}
	},
	{
		timestamps: true,
	}
);

//compare password
userSchema.statics.findByCredentials = async function (email, password) {
	const user = await User.findOne({ email });
	console.log(user)
	if (user === null) {
		throw new Error("không tìm thấy tài khoản");
	}
	const isMatch = await brcypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("tài khoản và mật khẩu không chính sác");
	}

	return user;
};

//relation
userSchema.virtual("tasks", {
	
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

//authtoken
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRECT );

	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

//Hash the password befor save
userSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await brcypt.hash(user.password, 8);
	}

	next();
});

//chặn show password
//toJSOn như kiểu bắt buộc chạy qua vậy
userSchema.methods.toJSON = function () {
	const user = this;

	//chuyển nó về toObject để có thể xóa key trong object
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
  delete userObject.avatar
	return userObject;
};

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
	const user = this;
	await Tasks.deleteMany({ owner: user._id });

	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
