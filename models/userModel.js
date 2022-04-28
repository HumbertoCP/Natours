const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlenght: [40, 'A name must have less or equal then 40 characters'],
        minlenght: [10, 'A name must have more or equal then 10 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlenght: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required'],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function(next) {
    // Only run this function if password was modified
    if(!this.isModified('password')) return next()

    // Hash password with coast of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete confirmPassword field
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000 // give margin to save on the db
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
        console.log(changedTimestamp, JWTTimestamp)

        return JWTTimestamp < changedTimestamp //true if password was not changed after the token was created
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User