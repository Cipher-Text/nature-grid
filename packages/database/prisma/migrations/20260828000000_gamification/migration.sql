-- Gamification: add badge storage and contribution points to UserProfile.
-- earnedBadges: array of badge keys (e.g. 'civic_guardian_bronze') owned by this user.
-- contributionPoints: cumulative points awarded as badges are earned.

ALTER TABLE "UserProfile"
  ADD COLUMN "earnedBadges"       TEXT[]  NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "contributionPoints" INTEGER NOT NULL DEFAULT 0;
