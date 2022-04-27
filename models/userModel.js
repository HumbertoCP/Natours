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
    }
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

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema);

module.exports = User