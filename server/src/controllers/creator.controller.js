const prisma = require('../utils/prisma')

async function list(req, res, next) {
  try {
    const { niche, platform, followersMin, followersMax, engMin, page = 1, limit = 12 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    let where = {}
    if (niche) {
      where.niche = { contains: niche }
    }
    if (followersMin || followersMax) {
      const column =
        platform === 'tiktok'
          ? 'tiktokFollowers'
          : platform === 'youtube'
            ? 'youtubeSubscribers'
            : platform === 'twitter'
              ? 'twitterFollowers'
              : 'instagramFollowers'
      where[column] = {}
      if (followersMin) where[column].gte = parseInt(followersMin)
      if (followersMax) where[column].lte = parseInt(followersMax)
    }
    if (engMin) where.avgEngagementRate = { gte: parseFloat(engMin) }

    const [creators, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { instagramFollowers: 'desc' }
      }),
      prisma.creator.count({ where })
    ])

    res.json({ creators, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    next(err)
  }
}

async function getOne(req, res, next) {
  try {
    const creator = await prisma.creator.findUnique({
      where: { username: req.params.username },
      include: { _count: { select: { collaborations: true, applications: true } } }
    })
    if (!creator) return res.status(404).json({ error: 'Creator not found' })
    res.json(creator)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const creator = await prisma.creator.findFirst({ where: { userId: req.user.userId } })
    if (!creator) return res.status(404).json({ error: 'Creator not found' })
    const allowed = ['displayName', 'bio', 'location', 'niche', 'avatarSeed']
    const data = {}
    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        data[k] = k === 'niche' ? JSON.stringify(req.body[k]) : req.body[k]
      }
    }
    const updated = await prisma.creator.update({ where: { id: creator.id }, data })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, update }

