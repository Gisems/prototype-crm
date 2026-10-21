import { type Group, type GroupFormValues, toGroupFormInput } from "core/models/group"
import type { TeamMember } from "core/models/team"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { GroupForm } from "./group-form"

interface GroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** El grupo que se edita; `null` para crear uno nuevo. */
  group: Group | null
  members: TeamMember[]
  onSubmit: (values: GroupFormValues) => Promise<boolean>
}

export function GroupDialog({ open, onOpenChange, group, members, onSubmit }: Readonly<GroupDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{group ? "Editar grupo" : "Nuevo grupo"}</DialogTitle>
          <DialogDescription>Elige quiénes lo integran y en qué horario atiende.</DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura parte de cero. */}
        <GroupForm
          initial={group ? toGroupFormInput(group) : undefined}
          members={members}
          submitLabel={group ? "Guardar" : "Crear grupo"}
          submittingLabel={group ? "Guardando…" : "Creando…"}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
