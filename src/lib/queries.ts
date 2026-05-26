import { getOptimizelyClient } from "./optimizely";

export async function getContentByPath(path: string) {
  const client = getOptimizelyClient();
  return client.getContentByPath(path);
}

export async function getStartPage() {
  return getContentByPath("/");
}

export async function getNavigationItems() {
  const client = getOptimizelyClient();
  return client.getItems("/");
}
