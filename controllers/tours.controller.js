const Tour = require('../models/tours.model')
const APIFeautures = require('../utils/apiFeatures')

async function getAllTours(req, res){
   try{
        const features = new APIFeautures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const tours = await features.query
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
            message: error,
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

async function getTourStats(req, res){
    try {
        const stats = await Tour.aggregate([
          {
            $match: { ratingsAverage: { $gte: 4.5 } }
          },
          {
            $group: {
              _id: { $toUpper: '$difficulty' },
              numTours: { $sum: 1 },
              numRatings: { $sum: '$ratingsQuantity' },
              avgRating: { $avg: '$ratingsAverage' },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' }
            }
          },
          {
            $sort: { avgPrice: 1 }
          }
          // {
          //   $match: { _id: { $ne: 'EASY' } }
          // }
        ]);
    
        res.status(200).json({
          status: 'success',
          data: {
            stats
          }
        });
      } catch (err) {
        res.status(404).json({
          status: 'fail',
          message: err
        });
      }
}

async function getMonthlyPlan(req, res){
    try {
        const year = req.params.year * 1; // 2021
    
        const plan = await Tour.aggregate([
          {
            $unwind: '$startDates'
          },
          {
            $match: {
              startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
              }
            }
          },
          {
            $group: {
              _id: { $month: '$startDates' },
              numTourStarts: { $sum: 1 },
              tours: { $push: '$name' }
            }
          },
          {
            $addFields: { month: '$_id' }
          },
          {
            $project: {
              _id: 0
            }
          },
          {
            $sort: { numTourStarts: -1 }
          },
          {
            $limit: 12
          }
        ]);
    
        res.status(200).json({
          status: 'success',
          data: {
            plan
          }
        });
      } catch (err) {
        res.status(404).json({
          status: 'fail',
          message: err
        });
      }
}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
}