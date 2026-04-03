const prisma = require('../utils/prisma')

async function getCounts(req, res, next) {
  try {
    const creators = await prisma.waitlistEntry.count({ where: { role: 'CREATOR' } })
    const brands = await prisma.waitlistEntry.count({ where: { role: 'BRAND' } })
    res.json({ creators: creators + 100, brands: brands + 5, total: creators + brands + 105 })
  } catch (err) {
    next(err)
  }
}

async function join(req, res, next) {
  try {
    const { name, email, role } = req.body
    if (!name || !email || !role) return res.status(400).json({ error: 'Missing fields' })
    if (!['CREATOR', 'BRAND'].includes(role)) return res.status(400).json({ error: 'Invalid role' })

    await prisma.waitlistEntry.upsert({
      where: { email },
      create: { name, email, role },
      update: {}
    })

    const creators = await prisma.waitlistEntry.count({ where: { role: 'CREATOR' } })
    const brands = await prisma.waitlistEntry.count({ where: { role: 'BRAND' } })
    const counts = { creators: creators + 100, brands: brands + 5, total: creators + brands + 105 }

    const io = req.app.get('io')
    if (io) io.emit('waitlist:update', counts)

    res.json({ success: true, counts })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCounts, join }

