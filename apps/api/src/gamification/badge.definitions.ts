/**
 * Static badge catalogue — every badge the platform can award.
 * Definitions live in code, not the DB, so adding a tier is a deploy not a migration.
 *
 * Key format:  {category}_{tier}   e.g. 'civic_guardian_bronze'
 * Points:      Bronze 25 · Silver 75 · Gold 150 · Emerald 300
 */

export type BadgeTier     = 'BRONZE' | 'SILVER' | 'GOLD' | 'EMERALD';
export type BadgeCategory =
  | 'civic_guardian'
  | 'water_sentinel'
  | 'clean_air_defender'
  | 'biodiversity_explorer'
  | 'restoration_pioneer';

export interface BadgeDef {
  key:         string;
  category:    BadgeCategory;
  tier:        BadgeTier;
  label:       string;         // human-readable category name
  tierLabel:   string;         // 'Bronze' | 'Silver' | 'Gold' | 'Emerald'
  emoji:       string;
  description: string;
  threshold:   number;         // contributions needed to earn this tier
  points:      number;         // cumulative points for owning this badge
}

const TIER_POINTS: Record<BadgeTier, number> = {
  BRONZE:  25,
  SILVER:  75,
  GOLD:    150,
  EMERALD: 300,
};

const TIER_LABELS: Record<BadgeTier, string> = {
  BRONZE:  'Bronze',
  SILVER:  'Silver',
  GOLD:    'Gold',
  EMERALD: 'Emerald',
};

// ── Category meta ─────────────────────────────────────────────────────────────

interface CategoryMeta {
  category:    BadgeCategory;
  label:       string;
  emoji:       string;
  tiers: Array<{
    tier:        BadgeTier;
    threshold:   number;
    description: string;
  }>;
}

const CATEGORIES: CategoryMeta[] = [
  {
    category: 'civic_guardian',
    label: 'Civic Guardian',
    emoji: '🛡️',
    tiers: [
      { tier: 'BRONZE',  threshold: 1,  description: 'Your first verified pollution report is on record — you are now a civic guardian.' },
      { tier: 'SILVER',  threshold: 5,  description: '5 verified reports — a trusted, consistent voice for Bangladesh\'s environment.' },
      { tier: 'GOLD',    threshold: 15, description: '15 verified reports — a pillar of civic accountability and environmental justice.' },
      { tier: 'EMERALD', threshold: 30, description: '30 verified reports — a champion of civic duty and environmental protection.' },
    ],
  },
  {
    category: 'water_sentinel',
    label: 'Water Sentinel',
    emoji: '🌊',
    tiers: [
      { tier: 'BRONZE',  threshold: 1,  description: 'First water quality observation logged — standing watch over Bangladesh\'s rivers.' },
      { tier: 'SILVER',  threshold: 5,  description: '5 water quality records submitted — a dedicated guardian of water bodies.' },
      { tier: 'GOLD',    threshold: 15, description: '15 water observations — a sentinel of rivers, wetlands, and coastal zones.' },
      { tier: 'EMERALD', threshold: 30, description: '30 water quality records — a water sentinel of the highest distinction.' },
    ],
  },
  {
    category: 'clean_air_defender',
    label: 'Clean Air Defender',
    emoji: '🌬️',
    tiers: [
      { tier: 'BRONZE',  threshold: 1,  description: 'First air quality contribution filed — defending the air Bangladeshis breathe.' },
      { tier: 'SILVER',  threshold: 5,  description: '5 air quality contributions — a steadfast defender of clean air.' },
      { tier: 'GOLD',    threshold: 15, description: '15 air quality records — fighting pollution at source and in the atmosphere.' },
      { tier: 'EMERALD', threshold: 30, description: '30 air quality contributions — an air quality champion of exceptional commitment.' },
    ],
  },
  {
    category: 'biodiversity_explorer',
    label: 'Biodiversity Explorer',
    emoji: '🌿',
    tiers: [
      { tier: 'BRONZE',  threshold: 1,  description: 'First research-grade species observation logged with GBIF-matched data.' },
      { tier: 'SILVER',  threshold: 5,  description: '5 verified species observations — enriching Bangladesh\'s biodiversity record.' },
      { tier: 'GOLD',    threshold: 15, description: '15 research-grade observations — a naturalist contributing to global science.' },
      { tier: 'EMERALD', threshold: 30, description: '30 verified species records — an explorer of exceptional biodiversity knowledge.' },
    ],
  },
  {
    category: 'restoration_pioneer',
    label: 'Restoration Pioneer',
    emoji: '🌳',
    tiers: [
      { tier: 'BRONZE',  threshold: 1,  description: 'Joined your first ecological restoration project — hands in the soil.' },
      { tier: 'SILVER',  threshold: 3,  description: 'Active in 3 restoration projects — a dedicated pioneer of ecological recovery.' },
      { tier: 'GOLD',    threshold: 8,  description: 'Participated in 8 restoration projects — restoring Bangladesh\'s natural heritage.' },
      { tier: 'EMERALD', threshold: 20, description: 'Contributed to 20 restoration projects — a pioneer of generational ecological change.' },
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

/** Keys of badges that require a count ≤ threshold for a given category. */
export function earnedKeysForCategory(
  category: BadgeCategory,
  count: number,
): string[] {
  return BADGE_DEFS
    .filter((b) => b.category === category && count >= b.threshold)
    .map((b) => b.key);
}

// ── Level thresholds ──────────────────────────────────────────────────────────

export interface LevelInfo {
  level:           number;
  label:           string;
  nextLevelPoints: number; // -1 means max level
}

export function computeLevel(points: number): LevelInfo {
  if (points >= 1200) return { level: 5, label: 'Environmental Leader', nextLevelPoints: -1 };
  if (points >= 600)  return { level: 4, label: 'Champion',             nextLevelPoints: 1200 };
  if (points >= 300)  return { level: 3, label: 'Advocate',             nextLevelPoints: 600 };
  if (points >= 100)  return { level: 2, label: 'Contributor',          nextLevelPoints: 300 };
  return               { level: 1, label: 'Newcomer',              nextLevelPoints: 100 };
}
