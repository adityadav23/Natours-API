const express = require('express')


const  {getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
} = require('../controllers/tours.controller')

const router = express.Router()

router.route('/tours').get(getAllTours).post(createTour)
router.route('/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router