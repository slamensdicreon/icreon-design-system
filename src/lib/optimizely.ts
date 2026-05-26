import { config, getClient } from "@optimizely/cms-sdk";

let initialized = false;

export function ensureOptimizelyConfig() {
  if (initialized) return;

  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn("OPTIMIZELY_GRAPH_SINGLE_KEY is not set. CMS content will not load.");
      return;
    }
    throw new Error(
      "OPTIMIZELY_GRAPH_SINGLE_KEY is not set. Check your .env.local file."
    );
  }

  config({
    apiKey,
    graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  });

  initialized = true;
}

export function isConfigured() {
  return initialized;
}

export function getOptimizelyClient() {
  ensureOptimizelyConfig();
  if (!initialized) {
    throw new Error("Optimizely SDK not configured — missing API key.");
  }
  return getClient();
}
