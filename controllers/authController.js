const User = require('../models/users.model')
const jwt = require('jsonwebtoken')

async function signUp(req, res){
    try {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      })

    const token = jwt.sign({id: newUser._id},
        process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })

} catch (error) {
    res.status(400).json({
        status: 'Failed to create new User',
        message: error
    }
    )
    console.log(error)
}

}

module.exports = {signUp,}