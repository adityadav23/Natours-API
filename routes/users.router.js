const express = require('express')


const  {getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/users.controller')

const {signUp,login} = require('../controllers/authController')

const router = express.Router()


router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router