import { X } from "lucide-react"

import { DAYS, type Group, isInSchedule, scheduleSummary } from "core/models/group"
import type { TeamMember } from "core/models/team"
import { initials } from "shared/utils/string"

/** Cuántas iniciales se muestran antes de resumir al resto en "+N". */
const MAX_VISIBLE_MEMBERS = 5

interface GroupCardProps {
  group: Group
  /** Quiénes del grupo siguen en el equipo. */
  members: TeamMember[]
  now: Date
  onEdit: () => void
  onDelete: () => void
}

export function GroupCard({ group, members, now, onEdit, onDelete }: Readonly<GroupCardProps>) {
  const isOpen = isInSchedule(group.schedule, now)
  const hidden = members.length - MAX_VISIBLE_MEMBERS

  return (
    <article className="relative flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Toda la tarjeta abre la edición: el botón se estira sobre ella y "Eliminar" queda por encima. */}
        <button
          type="button"
          onClick={onEdit}
          className="truncate text-left font-bold after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
        >
          {group.name}
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Eliminar el grupo ${group.name}`}
          className="relative z-10 -m-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>

      <span
        className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isOpen ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
        }`}
      >
        {isOpen ? "En horario ahora" : "Fuera de horario"}
      </span>

      <div className="flex min-h-8 items-center gap-1.5">
        {members.length === 0 && <span className="text-xs text-muted-foreground">Sin miembros</span>}
        {members.slice(0, MAX_VISIBLE_MEMBERS).map((member) => (
          <span
            key={member.id}
            title={member.name}
            className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          >
            {initials(member.name)}
          </span>
        ))}
        {hidden > 0 && <span className="text-xs text-muted-foreground">+{hidden}</span>}
      </div>

      <div className="flex gap-1.5" aria-label="Días de atención">
        {DAYS.map(({ key, label, letter }) => (
          <span
            key={key}
            title={label}
            className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
              group.schedule[key].active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{scheduleSummary(group.schedule)}</p>
    </article>
  )
}
