const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')


const toursRouter = require('./routes/tours.router')
const usersRouter = require('./routes/users.router')
const reviewsRouter = require('./routes/reviews.router')

const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

const app = express()

app.use(helmet())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many request from this IP! Please try again in an hour.'
})
app.use('/api', limiter)

app.use(express.json())

app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

app.use(express.static(`${__dirname}/public`))



app.use('/api/v1/tours' , toursRouter)
app.use('/api/v1/users', usersRouter )
app.use('/api/v1/reviews', reviewsRouter )


app.use(notFound)
app.use(errorHandler)

module.exports = app