import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const cookieName = "sp_builder_session"

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(";").map((p) => p.trim())
  for (const part of parts) {
    const eq = part.indexOf("=")
    if (eq === -1) continue
    const k = part.slice(0, eq)
    if (k !== name) continue
    return decodeURIComponent(part.slice(eq + 1))
  }
  return null
}

function randomKey() {
  return `${crypto.randomUUID().replaceAll("-", "")}${crypto.randomUUID().replaceAll("-", "")}`
}

const DraftSchema = z.object({
  step: z.number().min(0).max(10).optional(),
  selectedEventId: z.string().optional(),
  format: z.enum(["Tracked link", "Landing page"]).optional(),
  slug: z.string().min(1).max(80).optional(),
  headline: z.string().max(140).optional(),
  note: z.string().max(1000).optional(),
  accent: z.enum(["Primary", "Green"]).optional(),
  channels: z.record(z.boolean()).optional(),
})

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie")
  const existing = getCookieValue(cookieHeader, cookieName)
  const sessionKey = existing ?? randomKey()

  const draft = await prisma.campaignDraft.findUnique({
    where: { sessionKey },
    select: { data: true, updatedAt: true },
  })

  const res = NextResponse.json({
    sessionKey,
    draft: draft?.data ?? null,
    updatedAt: draft?.updatedAt?.toISOString() ?? null,
  })

  if (!existing) {
    res.cookies.set(cookieName, sessionKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return res
}

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie")
  const existing = getCookieValue(cookieHeader, cookieName)
  const sessionKey = existing ?? randomKey()

  const body = await req.json().catch(() => null)
  const parsed = DraftSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const saved = await prisma.campaignDraft.upsert({
    where: { sessionKey },
    create: {
      sessionKey,
      data: parsed.data,
    },
    update: {
      data: parsed.data,
    },
    select: { updatedAt: true },
  })

  const res = NextResponse.json({ ok: true, updatedAt: saved.updatedAt.toISOString() })

  if (!existing) {
    res.cookies.set(cookieName, sessionKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return res
}
