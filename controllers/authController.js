const AppError = require('../utils/appError')
const User = require('../models/users.model')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

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
    }
}

async function login(req, res, next){
    try {
        const { email, password} = req.body

        if(!password || !email){
           return next(new AppError('Please provide email and passsword',400))
        }
        //find if user exist using email
        const user = await User.findOne({email}).select('+password')
        //if no user found
        if(!user){
            return next(new AppError('No matching email found',404))
         }
         //check if password is correct
         const isCorrect =  await user.correctPassword(password, user.password)
         //wrong password
         if(!isCorrect){
            return next(new AppError('Please put correct password',401))
         }
         //get token
        const token = await user.createToken(user._id)

        res.status(200).json({
            status:'success',
            token
        })

    } catch (error) {
        res.status(400).json({
        status: 'Failed to login User',
        message: error
        })
    }
 }

 async function protect(req,res, next){
    // check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Invalid token in header ',401))
    }
    const token = authHeader.split(' ')[1]
    //if no token
    if(!token){
        return next(new AppError('You are not loggged in!',401))
    }
    try {
        //verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //check if user still exists after giving token
        const currentUser = await User.findById(payload.id)

        if(!currentUser){
        return next(new AppError(
            'The token belonging to the user does no longer exist ',
             401))
        }
        //Check if password was changed after token 
        if(await currentUser.changedPasswordAfter(payload.iat)){
            return next(new AppError('User recently changed password! Please login again!',401))
        }
        req.user = currentUser
        next()

    } catch (error) {
        return next(new AppError('Failed to login ',401))
    }
 }

const restrictTo = (...roles) =>{
      
      return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to accesss this route',403))
        }
        next()
    }
 }


async function forgotPassword(req, res, next){

    const user = await User.findOne({email: req.body.email})
    if(!user){
        next(new AppError(` This user doesn't exist `, 404))
    }

    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

     // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password
   and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please 
   ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
}
 
async function resetPassword(req, res, next){
   
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();


  // 4) Log the user in, send JWT get token
 const token = await user.createToken(user._id)

 res.status(200).json({
     status:'success',
     token
 })
}

async function updatePassword(req, res, next){
 // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

  // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

  // 4) Log user in, send JWT
    const token = await user.createToken(user._id)

    res.status(200).json({
     status:'success',
     token
 })
}
module.exports = {signUp, 
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
}