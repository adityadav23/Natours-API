const express = require('express')


const  {getAllTours,
} = require('../controllers/tours.controller')

const router = express.Router()

router.get('/tours',getAllTours)

module.exports = router