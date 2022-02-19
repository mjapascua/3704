const express = require('express')
const router = express.Router()
const {
    getHOAusers,
    setHOAuser,
    updateHOAuser,
    deleteHOAuser
} = require('../controllers/hoauserController')

router.route('/').get(getHOAusers).post(setHOAuser)

router.route('/:id').delete(deleteHOAuser).put(updateHOAuser)

module.exports = router