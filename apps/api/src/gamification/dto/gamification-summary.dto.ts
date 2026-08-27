export class MissingFieldDto {
  key:    string;
  label:  string;
  hint:   string;
  weight: number;
  href:   string; // deep-link into the profile tab that fixes this field
}

export class BadgeSummaryDto {
  key:         string;
  category:    string;
  tier:        string;
  label:       string;
  tierLabel:   string;
  emoji:       string;
  description: string;
  earned:      boolean;
  current:     number;
  threshold:   number;
  points:      number;
}

export class GamificationSummaryDto {
  completeness:  number;
  missingFields: MissingFieldDto[];
  badges:        BadgeSummaryDto[];
  points:        number;
  level:         number;
  levelLabel:    string;
  nextLevelPoints: number;
}
