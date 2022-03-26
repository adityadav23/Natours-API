require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const {connectDb} = require('../../db/connect')
const Tour = require('../../models/tours.model')


//Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`), 'utf-8')


async function makeConnection(){
    await connectDb(process.env.MONGO_URI)
    console.log('Connection successful')
    await Tour.deleteMany()
    console.log('All tours deleted!')
    await Tour.create(tours)
    console.log('Data successfully loaded!')
    process.exit()
}
makeConnection()



