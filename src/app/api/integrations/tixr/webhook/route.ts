import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashEmail } from "@/lib/tracking/crypto"

const TixrWebhookSchema = z.object({
  order_id: z.string(),
  event_id: z.string().optional(),
  purchased_at: z.string().optional(),
  gross_amount_cents: z.number().int().nonnegative(),
  currency: z.string().default("AUD"),
  buyer_email: z.string().email().optional(),
  attribution: z
    .object({
      campaign_id: z.string().optional(),
      creator_id: z.string().optional(),
      channel_link_code: z.string().optional(),
    })
    .optional(),
})

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function POST(req: Request) {
  const secret = process.env.TIXR_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "TIXR_WEBHOOK_SECRET is missing" },
      { status: 500 }
    )
  }

  const incoming = req.headers.get("x-stagepass-webhook-secret")
  if (incoming !== secret) return unauthorized()

  const body = await req.json().catch(() => null)
  const parsed = TixrWebhookSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const data = parsed.data
  const attribution = data.attribution ?? {}
  let eventId = data.event_id
  if (!eventId && attribution.campaign_id) {
    const campaignForEvent = await prisma.campaign.findUnique({
      where: { id: attribution.campaign_id },
      select: { eventId: true },
    })
    eventId = campaignForEvent?.eventId
  }
  if (!eventId) {
    return NextResponse.json(
      { error: "event_id or attribution.campaign_id is required" },
      { status: 400 }
    )
  }

  let channelLinkId: string | undefined
  if (attribution.channel_link_code) {
    const link = await prisma.channelLink.findUnique({
      where: { code: attribution.channel_link_code },
      select: { id: true },
    })
    channelLinkId = link?.id
  }

  const purchasedAt = data.purchased_at ? new Date(data.purchased_at) : new Date()

  const order = await prisma.order.upsert({
    where: {
      ticketingProvider_externalId: {
        ticketingProvider: "TIXR",
        externalId: data.order_id,
      },
    },
    create: {
      ticketingProvider: "TIXR",
      externalId: data.order_id,
      eventId,
      grossAmountCents: data.gross_amount_cents,
      currency: data.currency,
      purchasedAt,
      purchaserEmailHash: hashEmail(data.buyer_email),
      rawJson: body,
      attributedCampaignId: attribution.campaign_id,
      attributedCreatorId: attribution.creator_id,
      attributedClickId: undefined,
    },
    update: {
      grossAmountCents: data.gross_amount_cents,
      currency: data.currency,
      purchasedAt,
      purchaserEmailHash: hashEmail(data.buyer_email),
      rawJson: body,
      attributedCampaignId: attribution.campaign_id,
      attributedCreatorId: attribution.creator_id,
    },
  })

  // If attributed, create pending ledger entry once.
  if (order.attributedCampaignId && order.attributedCreatorId) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: order.attributedCampaignId },
      include: { event: true },
    })
    if (campaign) {
      const commissionBps = campaign.event.defaultCommissionBps
      const commissionAmountCents = Math.round(
        (order.grossAmountCents * commissionBps) / 10000
      )
      await prisma.commissionLedger.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          creatorId: order.attributedCreatorId,
          campaignId: order.attributedCampaignId,
          eventId: campaign.eventId,
          commissionBps,
          commissionAmountCents,
          status: "PENDING",
          currency: order.currency,
          availableAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        update: {},
      })
    }
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    channelLinkId: channelLinkId ?? null,
  })
}
