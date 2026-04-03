const router = require('express').Router()
const { signup, login, logout, me } = require('../controllers/auth.controller')
const authenticate = require('../middleware/authenticate')

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authenticate, me)

module.exports = router

