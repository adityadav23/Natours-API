const express = require('express')


const  {getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
} = require('../controllers/users.controller')

const {signUp,
    login,
    protect,
    forgotPassword,
    resetPassword,
    updatePassword,
    } = require('../controllers/authController')

const router = express.Router()


router.route('/signup').post(signUp)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)
router.route('/updateMyPassword').patch(protect,updatePassword)
router.route('/updateMe').patch(protect,updateMe)


router.route('/').get(protect,getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router