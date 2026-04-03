const prisma = require('../utils/prisma')

async function getSummary(req, res, next) {
  try {
    const creator = await prisma.creator.findUnique({ where: { id: req.params.id } })
    if (!creator) return res.status(404).json({ error: 'Creator not found' })

    const totalFollowers =
      creator.instagramFollowers + creator.tiktokFollowers + creator.youtubeSubscribers + creator.twitterFollowers

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const oldSnapshot = await prisma.analyticsSnapshot.findFirst({
      where: {
        creatorId: req.params.id,
        platform: 'instagram',
        snapshotDate: { lte: thirtyDaysAgo }
      },
      orderBy: { snapshotDate: 'desc' }
    })

    const followerGrowth30d = oldSnapshot
      ? Math.round(((creator.instagramFollowers - oldSnapshot.followers) / oldSnapshot.followers) * 100)
      : 0

    res.json({
      totalFollowers,
      instagramFollowers: creator.instagramFollowers,
      tiktokFollowers: creator.tiktokFollowers,
      youtubeSubscribers: creator.youtubeSubscribers,
      twitterFollowers: creator.twitterFollowers,
      avgEngagementRate: creator.avgEngagementRate,
      followerGrowth30d
    })
  } catch (err) {
    next(err)
  }
}

async function getSnapshots(req, res, next) {
  try {
    const { platform = 'instagram', range = '30d' } = req.query
    const days = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30
    const since = new Date()
    since.setDate(since.getDate() - days)

    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { creatorId: req.params.id, platform, snapshotDate: { gte: since } },
      orderBy: { snapshotDate: 'asc' }
    })

    res.json(snapshots)
  } catch (err) {
    next(err)
  }
}

module.exports = { getSummary, getSnapshots }

