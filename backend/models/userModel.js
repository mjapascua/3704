const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add your given name']
    },

    lastname: {
        type: String,
        required: [true, 'Please add your surname']
    },

    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Please add a password']
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)