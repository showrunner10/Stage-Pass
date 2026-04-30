import crypto from "crypto"

function getSalt() {
  return process.env.TRACKING_HASH_SALT || "dev-only-salt-change-me"
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export function hashWithSalt(input: string) {
  return sha256(`${getSalt()}::${input}`)
}

export function hashIp(ip: string | null) {
  if (!ip) return "unknown"
  return hashWithSalt(ip)
}

export function hashUserAgent(ua: string | null) {
  if (!ua) return "unknown"
  return hashWithSalt(ua)
}

export function hashEmail(email: string | null | undefined) {
  if (!email) return null
  return hashWithSalt(email.trim().toLowerCase())
}

