const express = require('express')


const  {getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/users.controller')

const {signUp,} = require('../controllers/authController')

const router = express.Router()


router.route('/signup').post(signUp)
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router