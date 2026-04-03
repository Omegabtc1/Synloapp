const router = require('express').Router()
const { getSummary, getSnapshots } = require('../controllers/analytics.controller')
const authenticate = require('../middleware/authenticate')

router.get('/creator/:id/summary', authenticate, getSummary)
router.get('/creator/:id/snapshots', authenticate, getSnapshots)

module.exports = router

