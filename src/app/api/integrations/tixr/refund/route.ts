import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const RefundSchema = z.object({
  order_id: z.string(),
  refunded_at: z.string().optional(),
  reason: z.string().optional(),
})

export async function POST(req: Request) {
  const secret = process.env.TIXR_WEBHOOK_SECRET
  const incoming = req.headers.get("x-stagepass-webhook-secret")
  if (!secret || incoming !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = RefundSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: {
      ticketingProvider_externalId: {
        ticketingProvider: "TIXR",
        externalId: parsed.data.order_id,
      },
    },
    include: { ledgerEntry: true },
  })

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // MVP acceptance criteria target:
  // refund inside pending window must void pending commission.
  if (order.ledgerEntry?.status === "PENDING") {
    await prisma.commissionLedger.update({
      where: { id: order.ledgerEntry.id },
      data: {
        status: "REVERSED",
        paidAt: null,
      },
    })
    return NextResponse.json({ ok: true, action: "pending_commission_voided" })
  }

  return NextResponse.json({
    ok: true,
    action: "no_pending_ledger_to_void",
    ledgerStatus: order.ledgerEntry?.status ?? null,
  })
}

