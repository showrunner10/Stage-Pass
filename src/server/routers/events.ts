import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createTRPCRouter, publicProcedure } from "@/server/trpc/trpc"

export const eventsRouter = createTRPCRouter({
  listPublic: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        city: z.string().optional(),
        category: z.string().optional(),
        take: z.number().min(1).max(50).default(24),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = {
        status: "LIVE" as const,
        ...(input.q
          ? {
              OR: [
                { title: { contains: input.q, mode: "insensitive" as const } },
                { city: { contains: input.q, mode: "insensitive" as const } },
                { venue: { contains: input.q, mode: "insensitive" as const } },
              ],
            }
          : {}),
        ...(input.city ? { city: { equals: input.city } } : {}),
      }

      const rows = await prisma.event.findMany({
        where,
        take: input.take + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        orderBy: { startsAt: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          heroImageUrl: true,
          city: true,
          venue: true,
          startsAt: true,
          defaultCommissionBps: true,
          ticketTiers: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { priceCents: true, currency: true },
          },
          org: { select: { name: true } },
        },
      })

      let nextCursor: string | undefined = undefined
      if (rows.length > input.take) {
        const next = rows.pop()
        nextCursor = next?.id
      }

      return { items: rows, nextCursor }
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const event = await prisma.event.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          heroImageUrl: true,
          city: true,
          venue: true,
          startsAt: true,
          endsAt: true,
          status: true,
          ticketingProvider: true,
          ticketingUrl: true,
          defaultCommissionBps: true,
          ticketTiers: {
            orderBy: { sortOrder: "asc" },
            select: { id: true, name: true, description: true, priceCents: true, currency: true },
          },
          org: { select: { name: true, slug: true } },
        },
      })
      return event
    }),
})

