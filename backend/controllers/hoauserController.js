const asyncHandler = require('express-async-handler')

// @desc    Get HOA users
// @route   GET /api/hoausers
// @access  Private
const getHOAusers = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Get HOA users" })
})

// @desc    Set HOA users
// @route   POST /api/hoausers
// @access  Private
const setHOAuser = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please enter an email')
    }
    
    res.status(200).json({ message: "Set HOA user" })
})

// @desc    Update HOA user
// @route   PUT /api/hoausers/:id
// @access  Private
const updateHOAuser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update HOA user ${req.params.id}` })
})

// @desc    Delete HOA user
// @route   DELETE /api/hoausers/:id
// @access  Private
const deleteHOAuser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete HOA user ${req.params.id}` })
})

module.exports = {
    getHOAusers,
    setHOAuser,
    updateHOAuser,
    deleteHOAuser
}