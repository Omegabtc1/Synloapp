const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

function signToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

async function signup(req, res, next) {
  try {
    const { email, password, role, name, username, industry, niche } = req.body

    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    if (!['CREATOR', 'BRAND'].includes(role)) {
      return res.status(400).json({ error: 'Role must be CREATOR or BRAND' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, passwordHash, role } })

    let profile
    if (role === 'CREATOR') {
      if (!username) return res.status(400).json({ error: 'Username required for creators' })
      const existingUsername = await prisma.creator.findUnique({ where: { username } })
      if (existingUsername) return res.status(409).json({ error: 'Username taken' })
      profile = await prisma.creator.create({
        data: {
          userId: user.id,
          username,
          displayName: name,
          avatarSeed: username,
          niche: JSON.stringify(niche || [])
        }
      })
    } else {
      profile = await prisma.brand.create({
        data: {
          userId: user.id,
          name,
          logoSeed: name,
          industry: industry || ''
        }
      })
    }

    // Upsert waitlist entry
    await prisma.waitlistEntry.upsert({
      where: { email },
      create: { name, email, role },
      update: {}
    })

    // Emit socket update
    const io = req.app.get('io')
    if (io) {
      const counts = await getWaitlistCounts()
      io.emit('waitlist:update', counts)
    }

    const token = signToken(user.id, role)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({ user: { id: user.id, email, role }, profile })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    let profile
    if (user.role === 'CREATOR') {
      profile = await prisma.creator.findUnique({ where: { userId: user.id } })
    } else {
      profile = await prisma.brand.findUnique({ where: { userId: user.id } })
    }

    const token = signToken(user.id, user.role)
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user: { id: user.id, email: user.email, role: user.role }, profile })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res) {
  res.clearCookie('token')
  res.json({ success: true })
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    let profile
    if (user.role === 'CREATOR') {
      profile = await prisma.creator.findUnique({ where: { userId: user.id } })
    } else {
      profile = await prisma.brand.findUnique({ where: { userId: user.id } })
    }

    res.json({ user: { id: user.id, email: user.email, role: user.role }, profile })
  } catch (err) {
    next(err)
  }
}

async function getWaitlistCounts() {
  const creators = await prisma.waitlistEntry.count({ where: { role: 'CREATOR' } })
  const brands = await prisma.waitlistEntry.count({ where: { role: 'BRAND' } })
  return { creators: creators + 100, brands: brands + 5, total: creators + brands + 105 }
}

module.exports = { signup, login, logout, me }

