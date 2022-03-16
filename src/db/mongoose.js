const mongoose = require("mongoose");
const validator = require("validator")

mongoose.connect(process.env.MONGO_URL)


// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     trim: true,
//     require: true
//   },
//   age: {
//     type: Number,
//     trim: true,
//     validate(value)
//     {
//       if (value < 0)
//       {
//         throw new Error("Age con cu gì vậy")
//       }
//     }
//   },
  
//   email: {  
//     type: String,
//     trim: true,
//     validate(value)
//     {
//       if (!validator.isEmail(value))
//       {
//         throw new Error("email invalid")
//       }
//     }
//   },
//   password: {
//     type: String,
//     require: true,
//     minlength: 7,
//     trim: true,
//     validate(value)
//     {
//       if (value.toLowerCase().includes('password'))
//       {
//         console.log(23)
//         throw new Erorr("Password cannot contain  'password'")
//       }
//     }
//   }
// })


// const me = new User({
//   name: "    Lý khôi   ",
//   age: 20,
//   email: " p@gmail.com ",
//   password: "password"
// })


// me.save().then(() =>
// { 
//   console.log(me)
// }).catch((error) =>
// {
//   console.log("Error!",error)
// })

// const task = new Task({
//   description: "di ngủ",
//   completed: false
// })

// task.save().then(() =>
// {
//   console.log(task)
// }).catch((error) =>
// {
//   console.log(error)
// })