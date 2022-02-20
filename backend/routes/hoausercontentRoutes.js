const express = require('express')
const router = express.Router()
const {
    getHOAuserscontent,
    setHOAusercontent,
    updateHOAusercontent,
    deleteHOAusercontent
} = require('../controllers/hoausercontentController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getHOAuserscontent).post(protect, setHOAusercontent)
router.route('/:id').delete(protect, deleteHOAusercontent).put(protect, updateHOAusercontent)

module.exports = router