import { headers } from "next/headers"

export async function createTRPCContext() {
  const h = await headers()
  return {
    headers: h,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

