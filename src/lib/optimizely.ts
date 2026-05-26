import { config, getClient } from "@optimizely/cms-sdk";

let initialized = false;

export function ensureOptimizelyConfig() {
  if (initialized) return;

  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  if (!apiKey) {
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

export function getOptimizelyClient() {
  ensureOptimizelyConfig();
  return getClient();
}
