const express = require('express')
const morgan = require('morgan')
const app = express()

const toursRouter = require('./routes/tours.router')
const usersRouter = require('./routes/users.router')
const notFound = require('./middleware/not-found')


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))



app.use('/api/v1/tours' , toursRouter)
app.use('/api/v1/users', usersRouter )

app.all('*', notFound)

module.exports = app