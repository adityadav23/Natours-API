const User = require('../models/users.model')

async function signUp(req, res){
    try {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      })
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
    }
    )
    console.log(error)
}

}

module.exports = {signUp,}