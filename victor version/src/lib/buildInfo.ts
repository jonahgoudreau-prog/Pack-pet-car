/**
 * Set by the GitHub workflow when it publishes an update, so Settings can show
 * which version is on the phone. Empty when running locally.
 */
export const buildInfo = {
  commit: process.env.EXPO_PUBLIC_COMMIT_SHA?.slice(0, 7) || 'local',
  publishedAt: process.env.EXPO_PUBLIC_PUBLISHED_AT || '',
};
