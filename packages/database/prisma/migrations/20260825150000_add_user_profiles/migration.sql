CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'PRIVATE');

CREATE TABLE "UserProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "phone" TEXT,
  "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
  "occupation" TEXT,
  "bio" TEXT,
  "expertise" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "researchInterests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "education" TEXT,
  "institution" TEXT,
  "locationDistrict" TEXT,
  "locationCountry" TEXT NOT NULL DEFAULT 'Bangladesh',
  "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
  "contactVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
  "linksVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

CREATE TABLE "UserSocialLink" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "platform" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserSocialLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSocialLink_userId_platform_key" ON "UserSocialLink"("userId", "platform");
CREATE INDEX "UserSocialLink_userId_idx" ON "UserSocialLink"("userId");

ALTER TABLE "UserProfile"
  ADD CONSTRAINT "UserProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSocialLink"
  ADD CONSTRAINT "UserSocialLink_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
