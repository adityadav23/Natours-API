const User = require('../models/users.model')
const AppError = require('../utils/appError')

async function getAllUsers(req, res){
try{

}catch(error){

}

}

async function getUser(req, res){
    res.send('1 user')
}

async function createUser(req, res){
    res.send('User created')
}

async function updateUser(req, res){
    res.send('User updated')
}

async function deleteUser(req, res){
    res.send('User deleted')
}

async function updateMe(req,res, next){
    if(req.body.password || req.body.passwordConfirm){
       return next(new AppError('This route is not for password updates.',400))
    }

    const {name, email}= req.body
    const queryObject = {}

    if(name){
        queryObject.name = name
    }
    if(email){
        queryObject.email = email
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id,
        queryObject,
        {
          runValidators:true,
          new: true  
        })
    res.status(200)
        .json({
            status: "success",
            data:{
                user:updatedUser
            }
        })
}


module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
}