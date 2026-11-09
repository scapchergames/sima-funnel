import experimentConfig from "@/funnel-config/experiments.json";

interface ExperimentVariant {
  id: string;
  weight: number;
  config: Record<string, unknown>;
}

interface Experiment {
  id: string;
  description: string;
  variants: ExperimentVariant[];
  active: boolean;
}

function pickVariant(experiment: Experiment): ExperimentVariant {
  const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const variant of experiment.variants) {
    rand -= variant.weight;
    if (rand <= 0) return variant;
  }
  return experiment.variants[experiment.variants.length - 1];
}

export function getExperimentVariants(): Record<string, string> {
  const variants: Record<string, string> = {};
  for (const exp of experimentConfig.experiments as Experiment[]) {
    if (!exp.active) continue;

    const storageKey = `sima_exp_${exp.id}`;
    const stored = typeof window !== "undefined"
      ? sessionStorage.getItem(storageKey)
      : null;

    if (stored) {
      variants[exp.id] = stored;
    } else {
      const chosen = pickVariant(exp);
      variants[exp.id] = chosen.id;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, chosen.id);
      }
    }
  }
  return variants;
}

export function getExperimentConfig(expId: string): Record<string, unknown> {
  const exp = (experimentConfig.experiments as Experiment[]).find((e) => e.id === expId);
  if (!exp || !exp.active) return {};

  const variantId = typeof window !== "undefined"
    ? sessionStorage.getItem(`sima_exp_${expId}`)
    : null;

  const variant = exp.variants.find((v) => v.id === variantId) ?? exp.variants[0];
  return variant.config;
}

export function getQuizMaxSteps(): number {
  const config = getExperimentConfig("quiz_length");
  return typeof config.maxSteps === "number" ? config.maxSteps : 15;
}

export function getDefaultPlanId(): string | null {
  const config = getExperimentConfig("pricing_model");
  return typeof config.defaultPlan === "string" ? config.defaultPlan : null;
}

export function getEmailPlacement(): "after_scan" | "after_teaser" {
  const config = getExperimentConfig("email_placement");
  return config.emailStep === "after_scan" ? "after_scan" : "after_teaser";
}
