require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') })

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const {
  CREATOR_SEEDS,
  BRAND_SEEDS,
  generateMetrics,
  daysFromEpoch
} = require('../server/src/services/simulationEngine')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear simulation data (keep schema stable for local dev).
  await prisma.analyticsSnapshot.deleteMany()
  await prisma.campaignApplication.deleteMany()
  await prisma.collaboration.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.creator.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.waitlistEntry.deleteMany()

  const passwordHash = await bcrypt.hash('Simulated@123', 12)

  // Seed brands first.
  const brandRecords = []
  for (const b of BRAND_SEEDS) {
    const user = await prisma.user.upsert({
      where: { email: `brand.${b.seed}@sim.platform` },
      update: {},
      create: { email: `brand.${b.seed}@sim.platform`, passwordHash, role: 'BRAND' }
    })

    const brand = await prisma.brand.create({
      data: {
        userId: user.id,
        name: b.name,
        bio: b.bio,
        logoSeed: b.name,
        industry: b.industry,
        website: '',
        isSimulated: true
      }
    })
    brandRecords.push(brand)
  }
  console.log(`Seeded ${brandRecords.length} brands`)

  // Seed creators + 90 days analytics.
  const today = new Date()
  const elapsed = daysFromEpoch(today)

  for (const c of CREATOR_SEEDS) {
    const user = await prisma.user.upsert({
      where: { email: `${c.username}@sim.platform` },
      update: {},
      create: { email: `${c.username}@sim.platform`, passwordHash, role: 'CREATOR' }
    })

    const metrics = generateMetrics(c.seed, elapsed)

    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        username: c.username,
        displayName: c.displayName,
        avatarSeed: c.username,
        location: c.location,
        niche: JSON.stringify(c.niche),
        isSimulated: true,

        instagramFollowers: metrics.instagram.followers,
        tiktokFollowers: metrics.tiktok.followers,
        youtubeSubscribers: metrics.youtube.followers,
        twitterFollowers: metrics.twitter.followers,
        avgEngagementRate: metrics.instagram.engagementRate
      }
    })

    // Generate 90 days of snapshots (keeps seed time manageable).
    const snapshotData = []
    for (let daysAgo = 90; daysAgo >= 0; daysAgo--) {
      const d = new Date(today)
      d.setDate(d.getDate() - daysAgo)
      const dayElapsed = daysFromEpoch(d)
      const m = generateMetrics(c.seed, dayElapsed)
      for (const platform of ['instagram', 'tiktok', 'youtube', 'twitter']) {
        snapshotData.push({
          creatorId: creator.id,
          snapshotDate: d,
          platform,
          ...m[platform]
        })
      }
    }

    await prisma.analyticsSnapshot.createMany({ data: snapshotData })
  }
  console.log(`Seeded ${CREATOR_SEEDS.length} creators with 90d analytics`)

  // Seed campaigns (3 per brand).
  const CAMPAIGN_TEMPLATES = [
    {
      title: 'Brand Awareness Push',
      description: 'We want authentic creators to showcase our product in their daily routines.',
      budget: 2500,
      budgetType: 'FIXED',
      status: 'ACTIVE'
    },
    {
      title: 'Product Launch Collab',
      description: 'Looking for creators to announce and review our new product line.',
      budget: 500,
      budgetType: 'PER_POST',
      status: 'ACTIVE'
    },
    {
      title: 'Long-term Ambassador',
      description: 'Seeking ongoing brand ambassadors for a 3-month collaboration.',
      budget: 8000,
      budgetType: 'FIXED',
      status: 'ACTIVE'
    },
    {
      title: 'UGC Content Sprint',
      description: 'Short-form video content creators needed for our social campaigns.',
      budget: 300,
      budgetType: 'PER_POST',
      status: 'ACTIVE'
    },
    {
      title: 'Holiday Campaign 2025',
      description: 'Festive content featuring our gift collection.',
      budget: 5000,
      budgetType: 'FIXED',
      status: 'ACTIVE'
    }
  ]

  const niches = [['beauty', 'fashion'], ['fitness', 'health'], ['food', 'lifestyle'], ['tech', 'gaming'], ['travel', 'lifestyle']]
  const platforms = [
    ['instagram', 'tiktok'],
    ['youtube', 'instagram'],
    ['tiktok', 'instagram'],
    ['youtube', 'twitter'],
    ['instagram']
  ]

  for (let i = 0; i < brandRecords.length; i++) {
    const brand = brandRecords[i]
    for (let j = 0; j < 3; j++) {
      const tpl = CAMPAIGN_TEMPLATES[(i * 3 + j) % CAMPAIGN_TEMPLATES.length]
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30 + j * 15)

      await prisma.campaign.create({
        data: {
          brandId: brand.id,
          title: tpl.title,
          description: tpl.description,
          budget: tpl.budget,
          budgetType: tpl.budgetType,
          niche: JSON.stringify(niches[i] || niches[0]),
          platforms: JSON.stringify(platforms[j % platforms.length]),
          deliverables: '3x feed posts, 5x stories, 1x reel',
          status: tpl.status,
          deadline
        }
      })
    }
  }
  console.log('Seeded campaigns')

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

