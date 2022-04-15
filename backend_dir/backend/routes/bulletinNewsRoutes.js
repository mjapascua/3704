const express = require('express')
const router = express.Router()
const {
  getBulletinNews,
  setBulletinNews,
  updateBulletinNews,
  deleteBulletinNews
} = require('../controllers/bulletinNewsController')

router.route('/').get(getBulletinNews).post(setBulletinNews)

router.route('/:id').delete(deleteBulletinNews).put(updateBulletinNews)

module.exports = router