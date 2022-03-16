const express = require("express")
const Tasks = require('./models/task.model');
const userRouter = require('./routers/user.route')
const taskRouter = require('./routers/task.router');
const jwt = require("jsonwebtoken");
require('./db/mongoose')


const app = express();
const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer = require('multer')
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb)
  {
    if (!file.originalname.match(/\.(doc||docx)$/))
    {
      return cb(new Error("Please upload a Word Document"))
    }
    cd(undefined, true)
  }
})

const errorMiddleware = (req, res, next) =>
{
  //error.message
  throw new Error("From my middleware")
}

app.post('/upload',errorMiddleware, (req, res) =>
{
  res.send("ok")
}, (error, req, res, next) =>
{
  console.log(error)
  res.status(400).send({error: error.message})
})  



app.listen(port, () =>
{
  console.log("Server is in up on port " + port)
})