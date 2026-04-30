import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const token = process.env.PAYOUT_JOB_TOKEN
  const incoming = req.headers.get("x-stagepass-job-token")
  if (!token || incoming !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  const cleared = await prisma.commissionLedger.findMany({
    where: {
      status: "CLEARED",
    },
    orderBy: { createdAt: "asc" },
  })

  if (cleared.length === 0) {
    return NextResponse.json({ ok: true, payoutsCreated: 0, paidEntries: 0 })
  }

  type LedgerEntry = (typeof cleared)[number]
  const grouped = new Map<string, LedgerEntry[]>()
  for (const entry of cleared) {
    const arr = grouped.get(entry.creatorId) ?? []
    arr.push(entry)
    grouped.set(entry.creatorId, arr)
  }

  let payoutsCreated = 0
  let paidEntries = 0

  const groupedEntries = Array.from(grouped.entries())
  for (const [creatorId, entries] of groupedEntries) {
    const amountCents = entries.reduce(
      (sum: number, e: LedgerEntry) => sum + e.commissionAmountCents,
      0
    )
    if (amountCents <= 0) continue

    const payout = await prisma.payout.create({
      data: {
        creatorId,
        status: "PAID",
        amountCents,
        currency: "AUD",
        periodStart: entries[0].createdAt,
        periodEnd: entries[entries.length - 1].createdAt,
        stripeTransferId: `mock_transfer_${Date.now()}_${creatorId.slice(0, 6)}`,
      },
    })
    payoutsCreated += 1

    const ids = entries.map((e: LedgerEntry) => e.id)
    const result = await prisma.commissionLedger.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "PAID",
        paidAt: now,
        payoutId: payout.id,
      },
    })
    paidEntries += result.count
  }

  return NextResponse.json({
    ok: true,
    payoutsCreated,
    paidEntries,
    paidAt: now.toISOString(),
    note: "MVP mock payout run complete. Replace with Stripe Connect transfer in production.",
  })
}
