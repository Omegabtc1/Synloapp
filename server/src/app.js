require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)

      const isConfiguredClient = origin === process.env.CLIENT_URL
      const isLocalhostDev = /^http:\/\/localhost:\d+$/.test(origin)

      if (isConfiguredClient || isLocalhostDev) return callback(null, true)

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/waitlist', require('./routes/waitlist.routes'))
app.use('/api/creators', require('./routes/creator.routes'))
app.use('/api/brands', require('./routes/brand.routes'))
app.use('/api/campaigns', require('./routes/campaign.routes'))
app.use('/api/analytics', require('./routes/analytics.routes'))
app.use('/api/collaborations', require('./routes/collaboration.routes'))

app.use(errorHandler)
module.exports = app

