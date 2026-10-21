import { type MemberFormValues, type TeamMember, toMemberFormInput } from "core/models/team"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { MemberForm, type MemberResult } from "./member-form"

interface MemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Quien se edita; `null` para agregar a alguien nuevo. */
  member: TeamMember | null
  isRoleLocked: boolean
  onSubmit: (values: MemberFormValues) => Promise<MemberResult>
}

export function MemberDialog({ open, onOpenChange, member, isRoleLocked, onSubmit }: Readonly<MemberDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? "Editar miembro" : "Agregar miembro"}</DialogTitle>
          <DialogDescription>
            {member
              ? "Cambia los datos o el rol de esta persona."
              : "La persona queda activa y ocupa un puesto de tu plan."}
          </DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura parte de cero. */}
        <MemberForm
          initial={member ? toMemberFormInput(member) : undefined}
          submitLabel={member ? "Guardar" : "Agregar"}
          submittingLabel={member ? "Guardando…" : "Agregando…"}
          isRoleLocked={isRoleLocked}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
