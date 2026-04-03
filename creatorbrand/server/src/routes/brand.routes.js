const router = require('express').Router()
const { getOne, getDashboard, update } = require('../controllers/brand.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/dashboard', authenticate, authorize('BRAND'), getDashboard)
router.get('/:id', getOne)
router.patch('/me', authenticate, authorize('BRAND'), update)

module.exports = router

