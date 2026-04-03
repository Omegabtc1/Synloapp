const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')
const { startSnapshotJob } = require('./services/snapshotService')

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
})

app.set('io', io)

io.on('connection', (socket) => {
  socket.on('waitlist:subscribe', async () => {
    const prisma = require('./utils/prisma')
    const creators = await prisma.waitlistEntry.count({ where: { role: 'CREATOR' } })
    const brands = await prisma.waitlistEntry.count({ where: { role: 'BRAND' } })
    socket.emit('waitlist:count', {
      creators: creators + 100,
      brands: brands + 5,
      total: creators + brands + 105
    })
  })
})

startSnapshotJob()

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})


