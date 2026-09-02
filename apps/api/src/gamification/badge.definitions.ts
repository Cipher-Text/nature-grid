/**
 * Static badge catalogue — every badge the platform can award.
 * Definitions live in code, not the DB, so adding a tier is a deploy not a migration.
 *
 * Key format:  {category}_{tier}   e.g. 'civic_guardian_bronze'
 * Points:      Bronze 25 · Silver 75 · Gold 150 · Emerald 300 · Platinum 500
 */

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'EMERALD' | 'PLATINUM';

export type BadgeCategory =
  | 'civic_guardian'
  | 'community_voice'
  | 'water_sentinel'
  | 'clean_air_defender'
  | 'biodiversity_explorer'
  | 'restoration_pioneer';

export interface BadgeDef {
  key:         string;
  category:    BadgeCategory;
  tier:        BadgeTier;
  label:       string;         // human-readable category name
  tierLabel:   string;         // 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Platinum'
  emoji:       string;
  description: string;
  threshold:   number;         // contributions needed to earn this tier
  points:      number;         // cumulative points for owning this badge
}

const TIER_POINTS: Record<BadgeTier, number> = {
  BRONZE:   25,
  SILVER:   75,
  GOLD:     150,
  EMERALD:  300,
  PLATINUM: 500,
};

const TIER_LABELS: Record<BadgeTier, string> = {
  BRONZE:   'Bronze',
  SILVER:   'Silver',
  GOLD:     'Gold',
  EMERALD:  'Emerald',
  PLATINUM: 'Platinum',
};

// ── Category meta ─────────────────────────────────────────────────────────────

interface CategoryMeta {
  category: BadgeCategory;
  label:    string;
  emoji:    string;
  tiers: Array<{
    tier:        BadgeTier;
    threshold:   number;
    description: string;
  }>;
}

const CATEGORIES: CategoryMeta[] = [
  // ── Civic Guardian ────────────────────────────────────────────────────────
  // Bronze unlocks on first SUBMITTED report (any status) — rewards the act
  // of reporting immediately. Silver and above require VERIFIED/RESOLVED
  // reports, rewarding quality and consistency over time.
  {
    category: 'civic_guardian',
    label: 'Civic Guardian',
    emoji: '🛡️',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,  description: 'First pollution report filed — your voice is now on record as a civic guardian.' },
      { tier: 'SILVER',   threshold: 5,  description: '5 verified reports — a trusted, consistent voice for Bangladesh\'s environment.' },
      { tier: 'GOLD',     threshold: 15, description: '15 verified reports — a pillar of civic accountability and environmental justice.' },
      { tier: 'EMERALD',  threshold: 30, description: '30 verified reports — a champion of civic duty and environmental protection.' },
      { tier: 'PLATINUM', threshold: 75, description: '75 verified reports — an exceptional, long-standing guardian of public accountability.' },
    ],
  },
  // ── Community Voice ───────────────────────────────────────────────────────
  // Counts posts + comments authored. The most citizen-accessible badge path —
  // any authenticated user can contribute to community discussion.
  {
    category: 'community_voice',
    label: 'Community Voice',
    emoji: '💬',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,   description: 'First community post or comment published — joining the environmental conversation.' },
      { tier: 'SILVER',   threshold: 10,  description: '10 community contributions — an active voice raising awareness.' },
      { tier: 'GOLD',     threshold: 30,  description: '30 contributions — a community pillar driving environmental awareness and action.' },
      { tier: 'EMERALD',  threshold: 75,  description: '75 contributions — an essential voice shaping collective environmental action.' },
      { tier: 'PLATINUM', threshold: 200, description: '200 contributions — an unparalleled community leader and environmental communicator.' },
    ],
  },
  // ── Water Sentinel ────────────────────────────────────────────────────────
  // Counts all WATER_QUALITY observations regardless of trust level.
  {
    category: 'water_sentinel',
    label: 'Water Sentinel',
    emoji: '🌊',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,  description: 'First water quality observation logged — standing watch over Bangladesh\'s rivers.' },
      { tier: 'SILVER',   threshold: 5,  description: '5 water quality records — a dedicated guardian of rivers and wetlands.' },
      { tier: 'GOLD',     threshold: 15, description: '15 water observations — a sentinel of rivers, wetlands, and coastal zones.' },
      { tier: 'EMERALD',  threshold: 30, description: '30 water quality records — a water sentinel of the highest distinction.' },
      { tier: 'PLATINUM', threshold: 60, description: '60 water quality records — an unrivalled guardian of Bangladesh\'s water systems.' },
    ],
  },
  // ── Clean Air Defender ────────────────────────────────────────────────────
  // Counts AIR_QUALITY observations + verified AIR_POLLUTION reports combined.
  {
    category: 'clean_air_defender',
    label: 'Clean Air Defender',
    emoji: '🌬️',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,  description: 'First air quality contribution filed — defending the air Bangladeshis breathe.' },
      { tier: 'SILVER',   threshold: 5,  description: '5 air quality contributions — a steadfast defender of clean air.' },
      { tier: 'GOLD',     threshold: 15, description: '15 air quality records — fighting pollution at source and in the atmosphere.' },
      { tier: 'EMERALD',  threshold: 30, description: '30 air quality contributions — a champion of exceptional commitment to clean air.' },
      { tier: 'PLATINUM', threshold: 60, description: '60 air quality contributions — an air quality defender of extraordinary dedication.' },
    ],
  },
  // ── Biodiversity Explorer ─────────────────────────────────────────────────
  // Counts BIODIVERSITY observations at RESEARCH_GRADE trust level only.
  // Thresholds are lower to reflect the difficulty of achieving research grade.
  {
    category: 'biodiversity_explorer',
    label: 'Biodiversity Explorer',
    emoji: '🌿',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,  description: 'First research-grade species observation — contributing verified data to global biodiversity science.' },
      { tier: 'SILVER',   threshold: 3,  description: '3 verified species records — enriching Bangladesh\'s biodiversity knowledge base.' },
      { tier: 'GOLD',     threshold: 10, description: '10 research-grade observations — a naturalist contributing meaningfully to global science.' },
      { tier: 'EMERALD',  threshold: 20, description: '20 verified species records — an explorer of exceptional biodiversity knowledge.' },
      { tier: 'PLATINUM', threshold: 40, description: '40 research-grade observations — a scientist of extraordinary biodiversity expertise.' },
    ],
  },
  // ── Restoration Pioneer ───────────────────────────────────────────────────
  // Counts unique restoration project participations (joins).
  {
    category: 'restoration_pioneer',
    label: 'Restoration Pioneer',
    emoji: '🌳',
    tiers: [
      { tier: 'BRONZE',   threshold: 1,  description: 'Joined your first ecological restoration project — hands in the soil.' },
      { tier: 'SILVER',   threshold: 3,  description: 'Active in 3 restoration projects — a dedicated pioneer of ecological recovery.' },
      { tier: 'GOLD',     threshold: 8,  description: 'Participated in 8 restoration projects — restoring Bangladesh\'s natural heritage.' },
      { tier: 'EMERALD',  threshold: 20, description: 'Contributed to 20 restoration projects — a pioneer of generational ecological change.' },
      { tier: 'PLATINUM', threshold: 40, description: 'Contributed to 40 restoration projects — an extraordinary champion of ecological recovery.' },
    ],
  },
];

// ── Flat badge catalogue ───────────────────────────────────────────────────────

export const BADGE_DEFS: BadgeDef[] = CATEGORIES.flatMap(({ category, label, emoji, tiers }) =>
  tiers.map(({ tier, threshold, description }) => ({
    key:       `${category}_${tier.toLowerCase()}`,
    category,
    tier,
    label,
    tierLabel: TIER_LABELS[tier],
    emoji,
    description,
    threshold,
    points:    TIER_POINTS[tier],
  })),
);

// ── Lookup helpers ────────────────────────────────────────────────────────────

export const BADGE_BY_KEY = new Map<string, BadgeDef>(
  BADGE_DEFS.map((b) => [b.key, b]),
);

/** All badge keys unlocked for a given category at the given count. */
export function earnedKeysForCategory(
  category: BadgeCategory,
  count: number,
): string[] {
  return BADGE_DEFS
    .filter((b) => b.category === category && count >= b.threshold)
    .map((b) => b.key);
}

// ── Level thresholds ──────────────────────────────────────────────────────────
// Max possible points: 6 categories × (25+75+150+300+500) = 6,300
// Levels are spaced so hitting max level genuinely requires completing most
// badge paths, keeping progression meaningful at the top end.

export interface LevelInfo {
  level:           number;
  label:           string;
  nextLevelPoints: number; // -1 means max level
}

export function computeLevel(points: number): LevelInfo {
  if (points >= 3500) return { level: 6, label: 'Guardian of Bangladesh',  nextLevelPoints: -1   };
  if (points >= 1800) return { level: 5, label: 'Environmental Leader',    nextLevelPoints: 3500 };
  if (points >= 900)  return { level: 4, label: 'Champion',                nextLevelPoints: 1800 };
  if (points >= 400)  return { level: 3, label: 'Advocate',                nextLevelPoints: 900  };
  if (points >= 100)  return { level: 2, label: 'Contributor',             nextLevelPoints: 400  };
  return               { level: 1, label: 'Newcomer',                nextLevelPoints: 100  };
}
