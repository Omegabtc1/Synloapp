const prisma = require('../utils/prisma')

async function create(req, res, next) {
  try {
    const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
    if (!brand) return res.status(404).json({ error: 'Brand not found' })
    const collab = await prisma.collaboration.create({
      data: {
        brandId: brand.id,
        creatorId: req.body.creatorId,
        campaignId: req.body.campaignId || null,
        message: req.body.message || ''
      }
    })
    res.status(201).json(collab)
  } catch (err) {
    next(err)
  }
}

async function list(req, res, next) {
  try {
    const { type = 'received' } = req.query
    let where = {}
    if (req.user.role === 'CREATOR') {
      const creator = await prisma.creator.findFirst({ where: { userId: req.user.userId } })
      where = type === 'sent' ? { creatorId: creator.id } : { creatorId: creator.id }
    } else {
      const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
      where = { brandId: brand.id }
    }
    const collabs = await prisma.collaboration.findMany({
      where,
      include: { brand: true, creator: true, campaign: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(collabs)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const collab = await prisma.collaboration.findUnique({ where: { id: req.params.id } })
    if (!collab) return res.status(404).json({ error: 'Not found' })
    const updated = await prisma.collaboration.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

module.exports = { create, list, update }

