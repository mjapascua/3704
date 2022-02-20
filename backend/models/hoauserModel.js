const mongoose = require('mongoose')

const hoauserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please enter an email']
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('HOAuser', hoauserSchema)