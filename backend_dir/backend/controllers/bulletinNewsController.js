const asyncHandler = require('express-async-handler')

const Article = require('../models/articleModel')

// @desc    Get Bulletin News
// @route   GET /api/bulletin-news
// @access  Private
const getBulletinNews = asyncHandler(async (req, res) => {
    const bulletinnews = await Article.find()
    
    res.status(200).json(bulletinnews)
})

// @desc    Set Bulletin News
// @route   POST /api/bulletin-news
// @access  Private
const setBulletinNews = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const bulletinnews = await Article.create({
        text: req.body.text
    })

    res.status(200).json(bulletinnews)
})

// @desc    Update Bulletin News
// @route   PUT /api/bulletin-news/:id
// @access  Private
const updateBulletinNews = asyncHandler(async (req, res) => {
    const bulletinnews = await Article.findById(req.params.id)

    if(!bulletinnews) {
        res.status(400)
        throw new Error('Bulletin News not found')
    }

    const updatedArticle = await Article.ArticlefindByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(updatedArticle)
})

// @desc    Delete Bulletin News
// @route   DELETE /api/bulletin-news
// @access  Private
const deleteBulletinNews = asyncHandler(async (req, res) => {
    const bulletinnews = await Article.findById(req.params.id)

    if(!bulletinnews) {
        res.status(400)
        throw new Error('Bulletin News not found')
    }

    await bulletinnews.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getBulletinNews,
    setBulletinNews,
    updateBulletinNews,
    deleteBulletinNews,
}