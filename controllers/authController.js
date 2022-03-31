const User = require('../models/users.model')

async function signUp(req, res){
    try {
    const newUser = await User.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })

} catch (error) {
    res.status(400).json({
        status: 'Failed to create new User',
        message: error
    })
}

}

module.exports = {signUp,}