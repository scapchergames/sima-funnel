export interface RegionAnalysis {
  region: string;
  observation: string;
  reading: string;
}

export interface Temperament {
  dominant: string;
  summary: string;
}

export interface CareerFit {
  bestSectors: string[];
  bestRoles: string[];
  avoidRoles: string[];
}

export interface Lifestyle {
  enjoyedActivities: string[];
  socialStyle: string;
  stressResponse: string;
}

export interface FullAnalysis {
  status: "ok" | "invalid_image" | "minor_detected";
  message: string;
  faceShape: string;
  regions: RegionAnalysis[];
  temperament: Temperament;
  highlights: string[];
  strengths: string[];
  weaknesses: string[];
  darkSide: string[];
  growthAreas: string[];
  careerFit: CareerFit;
  lifestyle: Lifestyle;
  narrative: string;
  disclaimer: string;
}

export interface TeaserResult {
  status: "ok" | "invalid_image" | "minor_detected";
  message: string;
  archetype: string;
  archetypeSummary: string;
  faceShape: string;
  openRegion: RegionAnalysis | null;
  lockedSections: string[];
}

export function toTeaser(full: FullAnalysis): TeaserResult {
  const archetype = full.temperament.dominant;
  const archetypeSummary = full.temperament.summary;
  const openRegion = full.regions[0] ?? null;
  const lockedSections = [
    "Mizaç Profili",
    "Güçlü Yönler",
    "Gelişim Alanları",
    "Kariyer Eğilimleri",
    "Yaşam Tarzı",
    "14 Bölge Analizi",
    "Gölge Taraf",
    "Kişisel Yorum",
  ];

  return {
    status: full.status,
    message: full.message,
    archetype,
    archetypeSummary,
    faceShape: full.faceShape,
    openRegion,
    lockedSections,
  };
}
