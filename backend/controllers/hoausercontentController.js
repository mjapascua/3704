const asyncHandler = require('express-async-handler')

const HOAusercontent = require('../models/hoausercontentModel')
const User = require('../models/hoausercontentModel')

// @desc    Get HOA users content
// @route   GET /api/hoausers
// @access  Private
const getHOAuserscontent = asyncHandler(async (req, res) => {
    const hoauserscontent = await HOAusercontent.find({ user: req.user.id })

    res.status(200).json(hoauserscontent)
})

// @desc    Set HOA users content
// @route   POST /api/hoausers
// @access  Private
const setHOAusercontent = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please enter text')
    }
    
    const hoausercontent = await HOAusercontent.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(200).json(hoausercontent)
})

// @desc    Update HOA user content
// @route   PUT /api/hoausers/:id
// @access  Private
const updateHOAusercontent = asyncHandler(async (req, res) => {
    const hoausercontent = await HOAusercontent.findById(req.params.id)
    
    if(!hoausercontent) {
        res.status(400)
        throw new Error('HOA User content not found')
    }

    const user = await User.findById(req.user.id)

    //Check for user
    if(!user) {
        res.status(401)
        throw new Error('HOA User not found')
    }

    //Make sure the logged in user matches the content user
    if(hoausercontent.user.toString() !== user.id) {
        res.status(401)
        throw new Error('HOA User not authorized')
    }

    const updatedhoausercontent = await HOAusercontent.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedhoausercontent)
})

// @desc    Delete HOA user content
// @route   DELETE /api/hoausers/:id
// @access  Private
const deleteHOAusercontent = asyncHandler(async (req, res) => {
    const hoausercontent = await HOAusercontent.findById(req.params.id)
    if(!hoausercontent) {
        res.status(400)
        throw new Error('HOA User content not found')
    }

    const user = await User.findById(req.user.id)

    //Check for user
    if(!user) {
        res.status(401)
        throw new Error('HOA User not found')
    }

    //Make sure the logged in user matches the content user
    if(hoausercontent.user.toString() !== user.id) {
        res.status(401)
        throw new Error('HOA User not authorized')
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