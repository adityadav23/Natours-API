const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,' Please tell me your name!']
    },
    email:{
        type:String,
        required: [true,'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide yoour email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
      },
    password:{
        type: String,
        required: [true,'Please provide your password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        validate:{
                validator: function(el){
                    return el === this.password
                },
                message: 'Passwords are not the same!'
            
        }
    },
    passwordChangedAt:{
        type: Date,
    },
    passwordResetToken: String,

    passwordResetTokenExpires: Date,
})

userSchema.pre('save', async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    //Hash
    this.password = await bcrypt.hash(this.password, salt)

    //delete confirmPassword field
    this.passwordConfirm = undefined
    next()

})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

userSchema.methods.correctPassword = async function(candidatePassword, userPassword)
{
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.createToken = async function(id){
    const token = await jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000,
            10
        )
        return JWTTimestamp < changedTimestamp
    }
    //False mean not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken =  crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
        
    this.passwordResetTokenExpires = Date.now() + 10*60*1000

    return resetToken;
}
module.exports = mongoose.model('User', userSchema)