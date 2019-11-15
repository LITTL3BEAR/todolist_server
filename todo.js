var express = require('express')
var router = express.Router()

const Schema = require('mongoose').Schema;
const mongooseModel = require('mongoose').model

const TodoSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdTime: { type: Date, required: true },
  updatedTime: { type: Date, required: true },
  status: { type: String, enum: ['published', 'removed'], required: true },
})
const TodoModel = mongooseModel('todos', TodoSchema)

// ใว้ทำ authen
// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/', async (_req, res) => {
  let results = await TodoModel.find({ status: 'published' }, { __v: 0 })
  // .then(results => results.map(({ id, name, description, }) => ({ id, name, description })))
  res.json(results)
})

router.get('/:id', async (req, res) => {
  let _id = req.params.id
  // let { name, id, description } = await TodoModel.findOne({ _id, status: 'published' })
  // res.json({ name, id, description })
  let results = await TodoModel.findOne({ _id, status: 'published' }, { __v: 0 })
  res.json(results)
})

router.post('/add', async (req, res) => {
  let { name, description } = req.body

  if (!name || !description) {
    res.status(403)
    res.json({
      status: 'error',
      message: 'name and description must not be null'
    })
    return null
  }

  const newTodo = new TodoModel()
  newTodo.name = name
  newTodo.description = description
  newTodo.createdTime = new Date()
  newTodo.updatedTime = new Date()
  newTodo.status = 'published'

  const records = await newTodo.save()

  res.json(records)
})

router.post('/edit/:id', async (req, res) => {
  let { name, description } = req.body
  let _id = req.params.id

  const todo = await TodoModel.findOne({ _id }).catch(() => null)
  if (todo === null) {
    res.status(403)
    res.json({
      status: 'error',
      message: 'todo id not found.'
    })
    return null
  } 

  let flag = false
  if (name) {
    todo.name = name
    flag = true
  }
  if (description) {
    todo.description = description
    flag = true
  }
  if (flag) {
    todo.updatedTime = new Date()
    const records = await todo.save()
    res.json(records)
    return null
  }
  res.json(todo)
})

router.post('/delete/:id', async (req, res) => {
  let _id = req.params.id

  const todo = await TodoModel.findOne({ _id }).catch(() => null)
  if (todo === null) {
    res.status(403)
    res.json({
      status: 'error',
      message: 'todo id not found.'
    })
    return null
  }

  todo.updatedTime = new Date()
  todo.status = 'removed'
  const records = await todo.save()
  res.json(records)
})

module.exports = router