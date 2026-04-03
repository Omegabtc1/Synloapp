const router = require('express').Router()
const { create, list, update } = require('../controllers/collaboration.controller')
const authenticate = require('../middleware/authenticate')

router.post('/', authenticate, create)
router.get('/', authenticate, list)
router.patch('/:id', authenticate, update)

module.exports = router

