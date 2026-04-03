const prisma = require('../utils/prisma')

async function getOne(req, res, next) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { campaigns: true, collaborations: true } } }
    })
    if (!brand) return res.status(404).json({ error: 'Brand not found' })
    res.json(brand)
  } catch (err) {
    next(err)
  }
}

async function getDashboard(req, res, next) {
  try {
    const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
    if (!brand) return res.status(404).json({ error: 'Not found' })

    const [activeCampaigns, totalApplications, activeCollabs] = await Promise.all([
      prisma.campaign.count({ where: { brandId: brand.id, status: 'ACTIVE' } }),
      prisma.campaignApplication.count({
        where: { campaign: { brandId: brand.id } }
      }),
      prisma.collaboration.count({ where: { brandId: brand.id, status: 'ACCEPTED' } })
    ])

    const recentApplications = await prisma.campaignApplication.findMany({
      where: { campaign: { brandId: brand.id } },
      include: { creator: true, campaign: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const campaigns = await prisma.campaign.findMany({
      where: { brandId: brand.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ brand, activeCampaigns, totalApplications, activeCollabs, recentApplications, campaigns })
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const brand = await prisma.brand.findFirst({ where: { userId: req.user.userId } })
    if (!brand) return res.status(404).json({ error: 'Brand not found' })
    const allowed = ['name', 'bio', 'website', 'industry', 'logoSeed']
    const data = {}
    for (const k of allowed) {
      if (req.body[k] !== undefined) data[k] = req.body[k]
    }
    const updated = await prisma.brand.update({ where: { id: brand.id }, data })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

module.exports = { getOne, getDashboard, update }

