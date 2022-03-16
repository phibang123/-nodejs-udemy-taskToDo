const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			require: true,
			trim: true,
		},
		completed: {
			type: Boolean,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},	
	}, {
		timestamps: true
	}
);

taskSchema.pre("save", async function (next) {
	const task = this;
	next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
