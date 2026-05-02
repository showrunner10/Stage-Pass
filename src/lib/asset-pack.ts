/** Promoter-hosted creator kit; static files live under /public/assets/packs */
export function assetPackUrlForSlug(slug: string): string {
  return `/assets/packs/${slug}-asset-pack.txt`;
}
