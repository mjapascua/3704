const mongoose = require('mongoose')

const hoausercontentSchema = mongoose.Schema(
    {
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