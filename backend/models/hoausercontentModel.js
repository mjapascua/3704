const mongoose = require('mongoose')

const hoausercontentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: [true, 'Please enter text']
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('HOAusercontent', hoausercontentSchema)