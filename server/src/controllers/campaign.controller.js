const prisma = require('../utils/prisma')

async function list(req, res, next) {
  try {
    const { status = 'ACTIVE', niche, platform, budgetMin, budgetMax, brandId, page = 1, limit = 12 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    let where = {}
    if (status) where.status = status
    if (brandId) where.brandId = brandId
    if (niche) where.niche = { contains: niche }
    if (platform) where.platforms = { contains: platform }
    if (budgetMin) where.budget = { ...where.budget, gte: parseFloat(budgetMin) }
    if (budgetMax) where.budget = { ...where.budget, lte: parseFloat(budgetMax) }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { brand: true, _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.campaign.count({ where })
    ])
    res.json({ campaigns, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    next(err)
  }
}

async function getOne(req, res, next) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { brand: true, _count: { select: { applications: true, collaborations: true } } }
    })
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    res.json(campaign)
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
    if (!brand) return res.status(404).json({ error: 'Brand not found' })
    const { title, description, budget, budgetType, niche, platforms, deliverables, deadline } = req.body
    const campaign = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        title,
        description,
        budget: parseFloat(budget),
        budgetType: budgetType || 'FIXED',
        niche: JSON.stringify(niche || []),
        platforms: JSON.stringify(platforms || []),
        deliverables: deliverables || '',
        status: 'DRAFT',
        deadline: deadline ? new Date(deadline) : null
      }
    })
    res.status(201).json(campaign)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id }, include: { brand: true } })
    if (!campaign) return res.status(404).json({ error: 'Not found' })
    const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
    if (campaign.brand.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' })
    const allowed = ['title', 'description', 'budget', 'budgetType', 'niche', 'platforms', 'deliverables', 'status', 'deadline']
    const data = {}
    for (const k of allowed) {
      if (req.body[k] !== undefined) {
        data[k] = ['niche', 'platforms'].includes(k) ? JSON.stringify(req.body[k]) : req.body[k]
      }
    }
    const updated = await prisma.campaign.update({ where: { id: req.params.id }, data })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

async function getApplications(req, res, next) {
  try {
    const apps = await prisma.campaignApplication.findMany({
      where: { campaignId: req.params.id },
      include: { creator: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(apps)
  } catch (err) {
    next(err)
  }
}

async function apply(req, res, next) {
  try {
    const creator = await prisma.creator.findFirst({ where: { userId: req.user.userId } })
    if (!creator) return res.status(404).json({ error: 'Creator not found' })
    const existing = await prisma.campaignApplication.findUnique({
      where: { campaignId_creatorId: { campaignId: req.params.id, creatorId: creator.id } }
    })
    if (existing) return res.status(409).json({ error: 'Already applied' })
    const app = await prisma.campaignApplication.create({
      data: { campaignId: req.params.id, creatorId: creator.id, message: req.body.message || '' }
    })
    res.status(201).json(app)
  } catch (err) {
    next(err)
  }
}

async function updateApplication(req, res, next) {
  try {
    const app = await prisma.campaignApplication.update({
      where: { id: req.params.appId },
      data: { status: req.body.status }
    })
    res.json(app)
  } catch (err) {
    next(err)
  }
}

module.exports = { list, getOne, create, update, getApplications, apply, updateApplication }

