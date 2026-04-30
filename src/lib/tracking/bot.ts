const BOT_PATTERNS = [
  "bot",
  "spider",
  "crawler",
  "headless",
  "lighthouse",
  "pingdom",
  "slurp",
  "wget",
  "curl",
]

export function looksLikeBot(userAgent: string | null) {
  if (!userAgent) return true
  const lower = userAgent.toLowerCase()
  return BOT_PATTERNS.some((p) => lower.includes(p))
}

