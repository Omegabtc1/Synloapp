function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Keep a deterministic generator (seed -> stable “simulated” creators).
const NICHES = [
  'lifestyle',
  'fashion',
  'beauty',
  'fitness',
  'food',
  'tech',
  'gaming',
  'travel',
  'music',
  'education',
  'finance',
  'comedy',
  'health',
  'art',
  'sustainability',
  'outdoor',
  'parenting'
]

const FIRST_NAMES = [
  'Alex',
  'Priya',
  'Kojo',
  'Luna',
  'Marcus',
  'Sofia',
  'Chen',
  'Amara',
  'Jake',
  'Mia',
  'Liam',
  'Zara',
  'Noah',
  'Isla',
  'Dev',
  'Chloe',
  'Felix',
  'Nina',
  'Omar',
  'Yuki',
  'Grace',
  'Ravi',
  'Ella',
  'Tom',
  'Sara',
  'Mike',
  'Aisha',
  'Leo',
  'Ruby',
  'Kai',
  'Vivienne',
  'Ben',
  'Emi',
  'Jack',
  'Olivia',
  'Rio',
  'Ada',
  'James',
  'Fiona',
  'Daniel',
  'Nia',
  'Sam',
  'Maya',
  'Cole',
  'Anna',
  'Will',
  'Hana',
  'Eric',
  'Lily',
  'Peter',
  'Zoe',
  'Marc',
  'Diana',
  'Chris',
  'Ling',
  'Josh',
  'Kate',
  'Mo',
  'Ava',
  'Paul',
  'Rosa',
  'Teo',
  'Jade',
  'Finn',
  'Leah',
  'Max',
  'Ines',
  'Andy',
  'Sue',
  'Henry',
  'Vera',
  'Kim',
  'Ray',
  'Mel',
  'Nico',
  'Bea',
  'Evan',
  'Tia',
  'Carl',
  'Iris',
  'Dominic',
  'Freya',
  'Oluwaseun',
  'Mara',
  'Siddharth',
  'Beth',
  'Hugo',
  'Lena',
  'Tunde',
  'Nora',
  'Alex',
  'Mia',
  'Daniel',
  'Luna',
  'Finn',
  'Grace',
  'Sam',
  'Ella',
  'Mohamed',
  'Yemi'
]

const LAST_NAMES = [
  'Carter',
  'Sharma',
  'Mensah',
  'Park',
  'Webb',
  'Andrade',
  'Wei',
  'Diallo',
  'Morrison',
  'Rodriguez',
  "O'Brien",
  'Hussain',
  'Kim',
  'Bennett',
  'Patel',
  'Martin',
  'Braun',
  'Larsson',
  'Hassan',
  'Tanaka',
  'Thompson',
  'Nair',
  'Fontaine',
  'Walker',
  'Lindqvist',
  "O'Connor",
  'Kamara',
  'Santos',
  'Chen',
  'Nakamura',
  'Moreau',
  'Stafford',
  'Suzuki',
  'Connelly',
  'Barnes',
  'Ferreira',
  'Kowalski',
  'Okonkwo',
  'McLean',
  'Reyes',
  'Asante',
  'Fischer',
  'Johansson',
  'Harrison',
  'Petrov',
  'Osei',
  'Yamamoto',
  'Bouchard',
  'Thornton',
  'Novak',
  'Campbell',
  'Lefebvre',
  'Okafor',
  'Stevenson',
  'Mei',
  'Rivera',
  'Sullivan',
  'Salah',
  'Dubois',
  'Ngozi',
  'Mendez',
  'Marchetti',
  'Wilson',
  'Eriksson',
  'Green',
  'Hoffmann',
  'Oliveira',
  'Mwangi',
  'Tanaka',
  'Adeyemi',
  'Sokolova',
  'Jeong',
  'Jackson',
  'Townsend',
  'Barbosa',
  'Hoffman',
  'Murray',
  'Bosomtwe',
  'Andersen',
  'Verhoeven',
  'Bello',
  'Hansen',
  'Adeola',
  'Kostadinova',
  'Iyer',
  'Crandall',
  'Leclerc',
  'Kovac',
  'Adeyemi',
  'Magnusson',
  'Dube',
  'Nakagawa',
  'Achebe',
  'Espinoza',
  'Larsen',
  'Otieno',
  'Ogundimu',
  'Watts',
  'El-Amin',
  'Adesanya'
]

const USERNAME_TOKENS = [
  'creates',
  'style',
  'fitness',
  'eats',
  'tech',
  'vlogs',
  'finance',
  'comedy',
  'games',
  'music',
  'art',
  'outdoor',
  'pottery',
  'crypto',
  'reads',
  'yoga',
  'minimal',
  'bakes',
  'invest',
  'story',
  'diary',
  'run',
  'hikes',
  'mindful',
  'garden'
]

const LOCATIONS = [
  'New York, US',
  'London, UK',
  'Accra, GH',
  'Seoul, KR',
  'Austin, US',
  'Lisbon, PT',
  'Singapore',
  'Paris, FR',
  'Denver, US',
  'Miami, US',
  'Dublin, IE',
  'Dubai, AE',
  'Vancouver, CA',
  'Sydney, AU',
  'Mumbai, IN',
  'Toronto, CA',
  'Berlin, DE',
  'Stockholm, SE',
  'Cairo, EG',
  'Tokyo, JP',
  'Chicago, US',
  'Bangalore, IN',
  'Edinburgh, UK',
  'Portland, US',
  'Oslo, NO',
  'Lagos, NG',
  'São Paulo, BR',
  'Melbourne, AU',
  'Honolulu, US',
  'Lyon, FR',
  'Johannesburg, ZA',
  'Amsterdam, NL',
  'Copenhagen, DK',
  'Prague, CZ',
  'Oxford, UK',
  'Rio de Janeiro, BR',
  'Warsaw, PL',
  'Houston, US',
  'Manhattan, US',
  'Montreal, CA',
  'Cape Town, ZA',
  'Utrecht, NL',
  'Nashville, US',
  'Rome, IT',
  'Atlanta, US',
  'Helsinki, FI',
  'Bristol, UK',
  'Vienna, AT',
  'Lyon, FR',
  'Naples, IT'
]

const CREATOR_SEEDS = (() => {
  const creators = []
  for (let seed = 1001; seed <= 1100; seed++) {
    const rngA = mulberry32(seed)
    const rngB = mulberry32(seed + 17)

    const first = FIRST_NAMES[Math.floor(rngA() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rngB() * LAST_NAMES.length)]

    const niche1 = NICHES[Math.floor(rngA() * NICHES.length)]
    let niche2 = NICHES[Math.floor(rngB() * NICHES.length)]
    if (niche2 === niche1) niche2 = NICHES[(NICHES.indexOf(niche1) + 3) % NICHES.length]

    const token = USERNAME_TOKENS[Math.floor(rngA() * USERNAME_TOKENS.length)]
    const username = `${first.toLowerCase().replace(/[^a-z]/g, '')}.${token}${seed}`
    const location = LOCATIONS[Math.floor(rngB() * LOCATIONS.length)]

    creators.push({
      username,
      displayName: `${first} ${last}`,
      niche: [niche1, niche2],
      location,
      seed
    })
  }
  return creators
})()

const BRAND_SEEDS = [
  { name: 'Lumique Beauty', industry: 'beauty', seed: 2001, bio: 'Premium skincare and cosmetics for all skin types.' },
  { name: 'TrailForge Gear', industry: 'outdoor', seed: 2002, bio: 'Performance outdoor and fitness equipment.' },
  { name: 'NovaTech Gadgets', industry: 'tech', seed: 2003, bio: 'Consumer electronics that simplify modern life.' },
  { name: 'Harvest & Co.', industry: 'food', seed: 2004, bio: 'Organic, sustainable food and beverage products.' },
  { name: 'Vitalis Health', industry: 'health', seed: 2005, bio: 'Science-backed supplements and wellness solutions.' }
]

function generateMetrics(seed, daysElapsed) {
  const rng = mulberry32(seed + daysElapsed * 137)
  const tierRoll = mulberry32(seed)() * 1
  let baseFollowers
  if (tierRoll < 0.45) baseFollowers = 5000 + mulberry32(seed)() * 45000
  else if (tierRoll < 0.75) baseFollowers = 50000 + mulberry32(seed)() * 150000
  else if (tierRoll < 0.93) baseFollowers = 200000 + mulberry32(seed)() * 800000
  else baseFollowers = 1000000 + mulberry32(seed)() * 4000000

  // Bias smaller seeds to create the “micro vs macro” distribution requested.
  const microFactor = seed <= 1050 ? 0.65 : 1
  baseFollowers = baseFollowers * microFactor

  const growthRate = 0.003 + mulberry32(seed + 1)() * 0.007
  const currentFollowers = Math.floor(baseFollowers * Math.pow(1 + growthRate, daysElapsed))
  const engRate = parseFloat((2.5 + rng() * 7.5).toFixed(2))

  return {
    instagram: {
      followers: currentFollowers,
      followingCount: Math.floor(300 + rng() * 2000),
      postsCount: Math.floor(40 + rng() * 600),
      avgLikes: Math.floor(currentFollowers * (0.02 + rng() * 0.05)),
      avgComments: Math.floor(currentFollowers * (0.002 + rng() * 0.006)),
      avgShares: Math.floor(currentFollowers * (0.001 + rng() * 0.003)),
      engagementRate: engRate,
      estimatedReach: Math.floor(currentFollowers * (0.25 + rng() * 0.4)),
      profileViews: Math.floor(currentFollowers * (0.04 + rng() * 0.12))
    },
    tiktok: {
      followers: Math.floor(currentFollowers * (0.4 + rng() * 1.6)),
      followingCount: Math.floor(100 + rng() * 500),
      postsCount: Math.floor(20 + rng() * 300),
      avgLikes: Math.floor(currentFollowers * (0.05 + rng() * 0.12)),
      avgComments: Math.floor(currentFollowers * (0.003 + rng() * 0.01)),
      avgShares: Math.floor(currentFollowers * (0.01 + rng() * 0.04)),
      engagementRate: parseFloat((4 + rng() * 12).toFixed(2)),
      estimatedReach: Math.floor(currentFollowers * (0.5 + rng() * 0.8)),
      profileViews: Math.floor(currentFollowers * (0.1 + rng() * 0.3))
    },
    youtube: {
      followers: Math.floor(currentFollowers * (0.15 + rng() * 0.7)),
      followingCount: Math.floor(10 + rng() * 200),
      postsCount: Math.floor(5 + rng() * 100),
      avgLikes: Math.floor(currentFollowers * (0.01 + rng() * 0.04)),
      avgComments: Math.floor(currentFollowers * (0.003 + rng() * 0.008)),
      avgShares: Math.floor(currentFollowers * (0.005 + rng() * 0.02)),
      engagementRate: parseFloat((1.5 + rng() * 5).toFixed(2)),
      estimatedReach: Math.floor(currentFollowers * (0.2 + rng() * 0.5)),
      profileViews: Math.floor(currentFollowers * (0.03 + rng() * 0.1))
    },
    twitter: {
      followers: Math.floor(currentFollowers * (0.1 + rng() * 0.6)),
      followingCount: Math.floor(200 + rng() * 3000),
      postsCount: Math.floor(50 + rng() * 2000),
      avgLikes: Math.floor(currentFollowers * (0.005 + rng() * 0.02)),
      avgComments: Math.floor(currentFollowers * (0.001 + rng() * 0.005)),
      avgShares: Math.floor(currentFollowers * (0.002 + rng() * 0.01)),
      engagementRate: parseFloat((0.5 + rng() * 3).toFixed(2)),
      estimatedReach: Math.floor(currentFollowers * (0.05 + rng() * 0.2)),
      profileViews: Math.floor(currentFollowers * (0.02 + rng() * 0.08))
    }
  }
}

// Baseline chosen so the default “last 90 days” simulation stays within INT ranges.
// (If EPOCH is too far in the past, follower counts can overflow SQLite INTEGER.)
const EPOCH = new Date('2026-01-01')

function daysFromEpoch(date = new Date()) {
  return Math.floor((date - EPOCH) / 86400000)
}

module.exports = {
  CREATOR_SEEDS,
  BRAND_SEEDS,
  generateMetrics,
  daysFromEpoch
}

