require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const {connectDb} = require('./db/connect')
const app = require('./app')

const PORT = process.env.PORT || 3000
const server = http.createServer(app)

async function startServer(){
    await connectDb(process.env.MONGO_URI)

    server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`)
})

}

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready!!')
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
})
startServer()