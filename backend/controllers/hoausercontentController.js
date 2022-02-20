const asyncHandler = require('express-async-handler')

const HOAusercontent = require('../models/hoausercontentModel')

// @desc    Get HOA users
// @route   GET /api/hoausers
// @access  Private
const getHOAuserscontent = asyncHandler(async (req, res) => {
    const hoauserscontent = await HOAusercontent.find()

    res.status(200).json(hoauserscontent)
})

// @desc    Set HOA users
// @route   POST /api/hoausers
// @access  Private
const setHOAusercontent = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please enter text')
    }
    
    const hoausercontent = await HOAusercontent.create({
        text: req.body.text
    })

    res.status(200).json(hoausercontent)
})

// @desc    Update HOA user
// @route   PUT /api/hoausers/:id
// @access  Private
const updateHOAusercontent = asyncHandler(async (req, res) => {
    const hoausercontent = await HOAusercontent.findById(req.params.id)
    if(!hoausercontent) {
        res.status(400)
        throw new Error('HOA User content not found')
    }

    const updatedhoausercontent = await HOAusercontent.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedhoausercontent)
})

// @desc    Delete HOA user
// @route   DELETE /api/hoausers/:id
// @access  Private
const deleteHOAusercontent = asyncHandler(async (req, res) => {
    const hoausercontent = await HOAusercontent.findById(req.params.id)
    if(!hoausercontent) {
        res.status(400)
        throw new Error('HOA User content not found')
    }

    await HOAusercontent.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getHOAuserscontent,
    setHOAusercontent,
    updateHOAusercontent,
    deleteHOAusercontent
}