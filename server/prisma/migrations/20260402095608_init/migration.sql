-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CREATOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "avatarSeed" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "niche" TEXT NOT NULL DEFAULT '[]',
    "isSimulated" BOOLEAN NOT NULL DEFAULT false,
    "instagramFollowers" INTEGER NOT NULL DEFAULT 0,
    "tiktokFollowers" INTEGER NOT NULL DEFAULT 0,
    "youtubeSubscribers" INTEGER NOT NULL DEFAULT 0,
    "twitterFollowers" INTEGER NOT NULL DEFAULT 0,
    "avgEngagementRate" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "creators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "logoSeed" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "isSimulated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "brands_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "budgetType" TEXT NOT NULL DEFAULT 'FIXED',
    "niche" TEXT NOT NULL DEFAULT '[]',
    "platforms" TEXT NOT NULL DEFAULT '[]',
    "deliverables" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "deadline" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "campaigns_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campaign_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "campaign_applications_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "campaign_applications_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "creators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "collaborations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "campaignId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "collaborations_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "collaborations_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "creators" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "collaborations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "snapshotDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "followingCount" INTEGER NOT NULL,
    "postsCount" INTEGER NOT NULL,
    "avgLikes" INTEGER NOT NULL,
    "avgComments" INTEGER NOT NULL,
    "avgShares" INTEGER NOT NULL,
    "engagementRate" REAL NOT NULL,
    "estimatedReach" INTEGER NOT NULL,
    "profileViews" INTEGER NOT NULL,
    CONSTRAINT "analytics_snapshots_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "creators" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "creators_userId_key" ON "creators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "creators_username_key" ON "creators"("username");

-- CreateIndex
CREATE UNIQUE INDEX "brands_userId_key" ON "brands"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_applications_campaignId_creatorId_key" ON "campaign_applications"("campaignId", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_entries_email_key" ON "waitlist_entries"("email");
