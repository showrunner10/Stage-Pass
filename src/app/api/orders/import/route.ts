import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const RowSchema = z.object({
  external_id: z.string(),
  event_id: z.string(),
  gross_amount_cents: z.number().int().nonnegative(),
  currency: z.string().default("AUD"),
  purchased_at: z.string().datetime().optional(),
  campaign_id: z.string().optional(),
  creator_id: z.string().optional(),
})

const ImportSchema = z.object({
  rows: z.array(RowSchema).min(1),
})

export async function POST(req: Request) {
  const token = process.env.ORDER_IMPORT_TOKEN
  const incoming = req.headers.get("x-stagepass-import-token")
  if (!token || incoming !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = ImportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const created: string[] = []
  for (const row of parsed.data.rows) {
    const order = await prisma.order.upsert({
      where: {
        ticketingProvider_externalId: {
          ticketingProvider: "MANUAL",
          externalId: row.external_id,
        },
      },
      create: {
        ticketingProvider: "MANUAL",
        externalId: row.external_id,
        eventId: row.event_id,
        grossAmountCents: row.gross_amount_cents,
        currency: row.currency,
        purchasedAt: row.purchased_at ? new Date(row.purchased_at) : new Date(),
        attributedCampaignId: row.campaign_id,
        attributedCreatorId: row.creator_id,
      },
      update: {
        grossAmountCents: row.gross_amount_cents,
        currency: row.currency,
        purchasedAt: row.purchased_at ? new Date(row.purchased_at) : new Date(),
        attributedCampaignId: row.campaign_id,
        attributedCreatorId: row.creator_id,
      },
    })
    created.push(order.id)
  }

  return NextResponse.json({ ok: true, count: created.length, orderIds: created })
}

