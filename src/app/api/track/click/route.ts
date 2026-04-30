import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashIp, hashUserAgent } from "@/lib/tracking/crypto"
import { looksLikeBot } from "@/lib/tracking/bot"

const BodySchema = z.object({
  code: z.string().min(2),
  landingUrl: z.string().url().optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const userAgent = req.headers.get("user-agent")
  if (looksLikeBot(userAgent)) {
    return NextResponse.json({ ok: true, skipped: "bot" })
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip")
  const ipHash = hashIp(ip ?? null)
  const uaHash = hashUserAgent(userAgent)

  const channel = await prisma.channelLink.findUnique({
    where: { code: parsed.data.code },
    include: { campaign: true },
  })

  if (!channel) {
    return NextResponse.json({ error: "Channel link not found" }, { status: 404 })
  }

  // Bot/noise filter: same hashed ip + ua + link within 5 seconds.
  const recent = await prisma.clickEvent.findFirst({
    where: {
      channelLinkId: channel.id,
      ipHash,
      uaHash,
      createdAt: { gte: new Date(Date.now() - 5000) },
    },
    select: { id: true },
  })
  if (recent) {
    return NextResponse.json({ ok: true, skipped: "duplicate" })
  }

  const click = await prisma.clickEvent.create({
    data: {
      channelLinkId: channel.id,
      campaignId: channel.campaignId,
      creatorId: channel.campaign.creatorId,
      eventId: channel.campaign.eventId,
      ipHash,
      uaHash,
      referrer: req.headers.get("referer"),
      landingUrl: parsed.data.landingUrl,
    },
    select: {
      id: true,
      campaignId: true,
      creatorId: true,
      eventId: true,
      createdAt: true,
    },
  })

  const res = NextResponse.json({ ok: true, click })
  res.cookies.set("sp_attr", JSON.stringify({
    channelLinkCode: channel.code,
    campaignId: click.campaignId,
    creatorId: click.creatorId,
    eventId: click.eventId,
    clickedAt: click.createdAt.toISOString(),
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}

