const Review = require('../models/reviews.model')

async function getAllReviews(req, res){
    const reviews = await Review.find()

    res.status(200).json({
        status: 'Success',
        results: reviews.length,
        data:{
            reviews
        }
    })
}

async function createReview(req, res){
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id

    const newReview = await Review.create(req.body)

    res.status(201).json({
        status: 'Success',
        data:{
            newReview
        }
    })
}


module.exports = { getAllReviews,
    createReview,
}