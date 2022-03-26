const fs = require('fs')
const tours = require('../models/tours.model')

async function getAllTours(req, res){
    const tours = JSON.parse(
        fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    )
    res.status(200).json({
        success: "true",
        results: tours.length,
        data:{
            tours
        }
    })

}

async function getTour(req, res){
    res.send('1 Tour')
}

async function createTour(req, res){
    try {
        const newTour = await tours.create(req.body)
        return res.status(201).json({
            status: "success",
            data:{
                tour: newTour
            }
        })
    } catch (error) {
       return res.status(400).json({
            status: "failed",
            message: 'Invalid input sent',
        })
    }
}

async function updateTour(req, res){
    res.send('Tour updated')
}

async function deleteTour(req, res){
    res.send('Tour deleted')
}



module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
}