import { createTRPCRouter } from "@/server/trpc/trpc"
import { eventsRouter } from "@/server/routers/events"

export const appRouter = createTRPCRouter({
  events: eventsRouter,
})

export type AppRouter = typeof appRouter

