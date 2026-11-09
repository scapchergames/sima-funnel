export interface FunnelSession {
  id: string;
  locale: string;
  angle: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
  experimentVariants: Record<string, string>;
  currentStep: string;
  quizAnswers: Record<string, string | string[]>;
  traits: Record<string, number>;
  analysisId: string | null;
  email: string | null;
  marketingOptIn: boolean;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SessionPatch = Partial<Omit<FunnelSession, "id" | "createdAt">>;
