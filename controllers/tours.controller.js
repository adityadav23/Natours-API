const Tour = require('../models/tours.model')

async function getAllTours(req, res){
   try {
       const tours = await Tour.find()
        return res.status(200).json({
            success: "true",
            results: tours.length,
            data:{
                tours
            }
        })
       
   } catch (error) {
       return res.status(400).json({
         status: "failed",
         message: error,
    })
   } 

}

async function getTour(req, res){
    try {
        const tour = await Tour.findById(req.params.id)
         return res.status(200).json({
             success: "true",
             data:{
                 tour: tour
             }
         })
        
    } catch (error) {
        return res.status(400).json({
          status: "failed",
          message: error,
     })
    } 
}

async function createTour(req, res){
    try {
        const newTour = await Tour.create(req.body)
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