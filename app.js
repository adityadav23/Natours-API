const express = require('express')
const morgan = require('morgan')
const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('tiny'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))


const toursRouter = require('./routes/tours.router')
const usersRouter = require('./routes/users.router')

app.use('/api/v1/tours' ,toursRouter)
app.use('/api/v1/users', usersRouter )

module.exports = app