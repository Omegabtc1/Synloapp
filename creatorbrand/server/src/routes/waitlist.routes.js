const router = require('express').Router()
const { getCounts, join } = require('../controllers/waitlist.controller')

router.get('/count', getCounts)
router.post('/join', join)

module.exports = router

