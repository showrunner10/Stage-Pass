import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const token = process.env.PAYOUT_JOB_TOKEN
  const incoming = req.headers.get("x-stagepass-job-token")
  if (!token || incoming !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  const result = await prisma.commissionLedger.updateMany({
    where: {
      status: "PENDING",
      availableAt: { lte: now },
    },
    data: {
      status: "CLEARED",
    },
  })

  return NextResponse.json({ ok: true, cleared: result.count, at: now.toISOString() })
}

