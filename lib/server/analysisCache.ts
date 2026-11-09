import { getStore } from "@netlify/blobs";
import type { FullAnalysis } from "@/lib/report/types";

function cacheStore() {
  return getStore({ name: "analysis-cache", consistency: "strong" });
}

export const analysisCache = {
  async has(key: string): Promise<boolean> {
    const val = await cacheStore().get(key);
    return val !== null;
  },
  async get(key: string): Promise<FullAnalysis | null> {
    const val = await cacheStore().get(key, { type: "json" });
    return (val as FullAnalysis | null) ?? null;
  },
  async set(key: string, value: FullAnalysis): Promise<void> {
    await cacheStore().setJSON(key, value);
  },
};
