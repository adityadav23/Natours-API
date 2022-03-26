const fs = require('fs')

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
    res.send('1 TOur')
}

async function createTour(req, res){
    res.send('Tour created')
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