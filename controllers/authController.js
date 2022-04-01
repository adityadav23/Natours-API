const AppError = require('../utils/appError')
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

    const token = await newUser.createToken(newUser._id)
    
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
        })
    console.log(error)
    }

}

async function login(req, res, next){
    try {
        const { email, password} = req.body

        if(!password || !email){
           return next(new AppError('Please provide email and passsword',400))
        }

        const user = await User.findOne({email}).select('+password')

        if(!user){
            return next(new AppError('No matching email found',404))
         }

         const isCorrect =  await user.correctPassword(password, user.password)

         if(!isCorrect){
            return next(new AppError('Please put correct password',401))
         }
         

        const token = await user.createToken(user._id)

        res.status(200).json({
            status:'success',
            token
        })

    } catch (error) {
        
    }
}



module.exports = {signUp, login}