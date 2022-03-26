const express = require('express')
const app = express()

const toursRouter = require('./routes/tours.router')


app.use('/api/v1' ,toursRouter)


module.exports = app