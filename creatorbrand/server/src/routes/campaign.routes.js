const router = require('express').Router()
const { list, getOne, create, update, getApplications, apply, updateApplication } = require('../controllers/campaign.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/', list)
router.post('/', authenticate, authorize('BRAND'), create)
router.get('/:id', getOne)
router.patch('/:id', authenticate, authorize('BRAND'), update)
router.get('/:id/applications', authenticate, getApplications)
router.post('/:id/apply', authenticate, authorize('CREATOR'), apply)
router.patch('/:id/applications/:appId', authenticate, authorize('BRAND'), updateApplication)

module.exports = router

