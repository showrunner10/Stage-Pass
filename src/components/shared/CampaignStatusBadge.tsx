import { Badge } from "@/components/ui/badge"

export function CampaignStatusBadge({
  status,
}: {
  status: "Draft" | "Live" | "Paused" | "Archived"
}) {
  if (status === "Live") return <Badge variant="success">Live</Badge>
  if (status === "Paused")
    return (
      <Badge variant="premium" className="border-white/10 text-offwhite/80">
        Paused
      </Badge>
    )
  if (status === "Archived")
    return (
      <Badge variant="premium" className="border-white/10 text-offwhite/55">
        Archived
      </Badge>
    )
  return (
    <Badge variant="premium" className="border-white/10 text-offwhite/80">
      Draft
    </Badge>
  )
}
