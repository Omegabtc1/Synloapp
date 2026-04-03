const prisma = require('../utils/prisma')
const { CREATOR_SEEDS, generateMetrics, daysFromEpoch } = require('./simulationEngine')

async function writeDailySnapshots() {
  const today = new Date()
  const elapsed = daysFromEpoch(today)
  const creators = await prisma.creator.findMany({ where: { isSimulated: true } })

  for (const creator of creators) {
    const seedData = CREATOR_SEEDS.find((c) => c.username === creator.username)
    if (!seedData) continue
    const m = generateMetrics(seedData.seed, elapsed)
    for (const platform of ['instagram', 'tiktok', 'youtube', 'twitter']) {
      await prisma.analyticsSnapshot.create({
        data: { creatorId: creator.id, snapshotDate: today, platform, ...m[platform] }
      })
    }
    await prisma.creator.update({
      where: { id: creator.id },
      data: {
        instagramFollowers: m.instagram.followers,
        tiktokFollowers: m.tiktok.followers,
        youtubeSubscribers: m.youtube.followers,
        twitterFollowers: m.twitter.followers,
        avgEngagementRate: m.instagram.engagementRate
      }
    })
  }
  console.log(`Snapshots written at ${today.toISOString()}`)
}

function startSnapshotJob() {
  writeDailySnapshots()
  setInterval(writeDailySnapshots, 24 * 60 * 60 * 1000)
}

module.exports = { startSnapshotJob, writeDailySnapshots }

