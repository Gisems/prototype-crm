import { isLastActiveAdmin, type TeamMember } from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { Switch } from "shared/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"
import { initials } from "shared/utils/string"

const LAST_ADMIN_HINT = "Debe quedar al menos un administrador activo"

interface MemberTableProps {
  members: TeamMember[] | undefined
  isPending: boolean
  isError: boolean
  /** Hay un cambio de estado en curso: se deshabilitan los interruptores para no cruzar dos pedidos. */
  isToggling: boolean
  onToggle: (member: TeamMember, active: boolean) => void
  onEdit: (member: TeamMember) => void
  onRemove: (member: TeamMember) => void
}

export function MemberTable({
  members,
  isPending,
  isError,
  isToggling,
  onToggle,
  onEdit,
  onRemove,
}: Readonly<MemberTableProps>) {
  if (isPending) return <Skeleton className="h-48 rounded-lg" />

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar el equipo. Intenta de nuevo.</p>

  if (!members?.length) {
    return <p className="text-sm text-muted-foreground">Todavía no agregaste miembros del equipo.</p>
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isProtected = isLastActiveAdmin(members, member)

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                    >
                      {initials(member.name)}
                    </span>
                    <span className="font-semibold">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2" title={isProtected ? LAST_ADMIN_HINT : undefined}>
                    <Switch
                      checked={member.active}
                      disabled={isProtected || isToggling}
                      aria-label={`${member.name}: ${member.active ? "activo" : "inactivo"}`}
                      onCheckedChange={(checked) => onToggle(member, checked)}
                    />
                    <span className="text-sm text-muted-foreground">{member.active ? "Activo" : "Inactivo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(member)}>
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isProtected}
                    title={isProtected ? LAST_ADMIN_HINT : undefined}
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRemove(member)}
                  >
                    Quitar
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
