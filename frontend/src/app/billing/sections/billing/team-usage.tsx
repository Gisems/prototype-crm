import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import type { TeamMember } from "core/models/team"
import { PATHS } from "router/paths"
import { Skeleton } from "shared/components/ui/skeleton"
import { initials } from "shared/utils/string"

import { UsageBar } from "./usage-bar"

interface TeamUsageProps {
  members: TeamMember[] | undefined
  seatsIncluded: number
  isPending: boolean
}

export function TeamUsage({ members, seatsIncluded, isPending }: Readonly<TeamUsageProps>) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">Equipo</h2>
        <Link
          to={PATHS.SETTINGS.TEAM}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Administrar equipo <ArrowRight className="size-4" />
        </Link>
      </div>

      {isPending && <Skeleton className="h-24 rounded-lg" />}

      {members && (
        <>
          <UsageBar label="Miembros del equipo" used={members.length} included={seatsIncluded} />

          <ul className="min-h-0 flex-1 divide-y overflow-y-auto">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-3 py-2">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                >
                  {initials(member.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {member.role}
                  {!member.active && " · Inactivo"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
