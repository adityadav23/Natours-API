const express = require('express')


const  {getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/users.controller')

const router = express.Router()

router.route('/users').get(getAllUsers).post(createUser)
router.route('/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router