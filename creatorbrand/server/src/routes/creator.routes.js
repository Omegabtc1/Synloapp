const router = require('express').Router()
const { list, getOne, update } = require('../controllers/creator.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/', list)
router.get('/:username', getOne)
router.patch('/me', authenticate, authorize('CREATOR'), update)

module.exports = router

