const express = require('express')
const router = express.Router()
const {
    getHOAuserscontent,
    setHOAusercontent,
    updateHOAusercontent,
    deleteHOAusercontent
} = require('../controllers/hoausercontentController')

router.route('/').get(getHOAuserscontent).post(setHOAusercontent)

router.route('/:id').delete(deleteHOAusercontent).put(updateHOAusercontent)

module.exports = router