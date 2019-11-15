const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const todo = require('./todo')

app.use(bodyParser.json())
app.use(cors())
app.use('/todo', todo)

app.get('/checkhealth', (_req, res) => {
  res.send('OK')
  res.end()
})

app.listen(3000, () => {
  console.log('Running server on 3000 port')
})