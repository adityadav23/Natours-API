const Tour = require('../models/tours.model')

async function getAllTours(req, res){
   try{
       const queryObj = {...req.query}
       const excludedFields = ['page', 'sort','limit', 'fields']
       excludedFields.forEach(el=> delete queryObj[el])

       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
       console.log(JSON.parse(queryStr))

       const query = Tour.find(JSON.parse(queryStr))
       const tours = await query

        return res.status(200).json({
            success: "true",
            results: tours.length,
            data:{
                tours
            }
        })
       
   } catch (error) {
       return res.status(404).json({
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
        return res.status(404).json({
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
       return res.status(404).json({
            status: "failed",
            message: 'Invalid input sent',
        })
    }
}

async function updateTour(req, res){
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id,
             req.body,
             {
                 new: true,
                runValidators: true
             },
            )
         return res.status(200).json({
             success: "true",
             data:{
                 tour
             }
         })
        
    } catch (error) {
        return res.status(404).json({
          status: "failed",
          message: error,
        })
    }
}

async function deleteTour(req, res){
    try {
        await Tour.findByIdAndDelete(req.params.id)
            
         return res.status(204).json({
             data: null,
             success: true
         })
        
    } catch (error) {
        return res.status(404).json({
          status: "failed",
          message: error,
        })
    }

}



module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
}