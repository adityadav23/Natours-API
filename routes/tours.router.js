const express = require('express')
const  {getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
} = require('../controllers/tours.controller')
const {protect,
    restrictTo,} = require('../controllers/authController')

const router = express.Router()

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect,getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour)
    .delete(protect,
        restrictTo('lead-guide', 'admin'),
        deleteTour)

module.exports = router