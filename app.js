const express = require('express')
const app = express()

const toursRouter = require('./routes/tours.router')
const usersRouter = require('./routes/users.router')

app.use('/api/v1' ,toursRouter)
app.use('/api/v1', usersRouter )

module.exports = app