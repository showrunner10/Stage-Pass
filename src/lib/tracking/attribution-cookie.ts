import { cookies } from "next/headers"

export const ATTR_COOKIE = "sp_attr"

export type AttributionCookie = {
  channelLinkCode: string
  campaignId: string
  creatorId: string
  eventId: string
  clickedAt: string
}

export async function setAttributionCookie(value: AttributionCookie) {
  const jar = await cookies()
  jar.set(ATTR_COOKIE, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function readAttributionCookie(): Promise<AttributionCookie | null> {
  const jar = await cookies()
  const raw = jar.get(ATTR_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as AttributionCookie
  } catch {
    return null
  }
}
