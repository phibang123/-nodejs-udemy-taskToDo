const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const Tasks = require('../models/task.model')

router.post("/tasks",auth, async (req, res) =>
{
  const task = new Tasks({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

//Get /tasks lấy tất cả task của user
//Get /tasks?completed=true lấy task completed true
//Get /tasks?limit=1 lấy task giới hạn 1 task
//Get /tasks?limit=1&skip=1 lấy task giới hạn 1 task ở trang 1, phân trang
//Get /tasks?sortBy=createdAt:desc lấy task sort tăng dần theo ngày hoàn thành

router.get('/tasks',auth, async (req, res) =>
{
  const match = {}
  const sort = {}


  if (req.query.completed)
  {
    //cái này kiểm tra xem complate có tồn tại hay không 
    //có thì nó check cái completed là string true false
    //req.query.completed === "true" là trả về true hay false nếu nó === "true"
    match.completed = req.query.completed === "true"
  }
  if (req.query.sortBy)
  {
    const parts = req.query.sortBy.split(':');
    //cái này xịn vl
    
    //asc
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    console.log(sort)
  }
  try {
    //const tasks = await Tasks.find({owner: req.user._id})
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
        // sort: {
        //   //trừ 1 là giảm dần
        //   // 1 là tăng dần
        //   createAt: -1
        // }
      }
    })
    res.status(200).send(req.user.tasks)
  } catch (error) {
    res.status(500).send(error)
    
  }
})


router.get('/tasks/:id',auth, async (req, res) =>
{
  const _id = req.params.id
  console.log(req.user)
  try {
    const task = await Tasks.findById({ _id ,owner: req.user._id});
    await task.populate('owner')
    console.log(task.owner)
    if (!task)
    {
      return res.status(404).send()
    }
    res.status(200).send(task)
  } catch (error)
  {
    console.log(error)
    res.status(500).send(error)
  }
  // Tasks.findById({_id}).then((task) => {
  //   if (!task)
  //   {
  //     return res.status(404).send()
  //   }
  //   res.send(task)
  // }).catch((e) =>
  // {
  //   res.status(500).send(e)
  // })
})


router.patch("/tasks/:id",auth, async (req, res) =>
{
  const updates = Object.keys(req.body)
  const allowedUpdates = ["description", "completed"]
  const isValiOperetion = updates.every((update) =>
  {
    return allowedUpdates.includes(update)
  })
  if (!isValiOperetion)
  {
    return res.status(400).send({
      error: "dmm"
    })
  }
  try {
    //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    const task = await Tasks.findOne({_id: req.params.id,owner: req.user._id})
    if (!task)
    {
      return res.status(400).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.status(200).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})


router.delete('tasks/:id',auth, async (req, res) =>
{
  try {
    //const task = await Tasks.findByIdAndDelete(req.params.id)
    const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if (!task)
    {
      return user.status(404).send()
    }res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})




module.exports = router