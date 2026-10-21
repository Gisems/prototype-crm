import { useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import {
  useCreateMember,
  useRemoveMember,
  useSetMemberActive,
  useUpdateMember,
} from "core/hooks/mutation/use-mutation-team"
import { usePlans, useSubscription } from "core/hooks/query/use-query-billing"
import { useTeamMembers } from "core/hooks/query/use-query-team"
import { isHttpFailure } from "core/lib/client/failure"
import { isLastActiveAdmin, type MemberFormValues, type TeamMember, toCreateMemberDto } from "core/models/team"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"

import { MemberDialog } from "../../sections/settings/team/member-dialog"
import type { MemberResult } from "../../sections/settings/team/member-form"
import { MemberTable } from "../../sections/settings/team/member-table"
import { TeamHeader } from "../../sections/settings/team/team-header"

export default function TeamTab() {
  // El mismo diálogo agrega y edita: `editingMember` es a quién se edita, o `null` para agregar.
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)
  const { data: members, isPending, isError } = useTeamMembers()
  // El plan dice cuántos puestos incluye; es el mismo dato que ve Plan y facturación.
  const { data: plans } = usePlans()
  const { data: subscription } = useSubscription()
  const { mutateAsync: createMember } = useCreateMember()
  const { mutateAsync: updateMember } = useUpdateMember()
  const { mutateAsync: setActive, isPending: isToggling } = useSetMemberActive()
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveMember()

  const plan = plans?.find((item) => item.id === subscription?.planId)

  function openDialog(member: TeamMember | null) {
    setEditingMember(member)
    setIsDialogOpen(true)
  }

  async function handleSubmit(values: MemberFormValues): Promise<MemberResult> {
    try {
      if (editingMember) {
        await updateMember({ id: editingMember.id, dto: toCreateMemberDto(values) })
        toast.success(`Datos de ${values.name} actualizados`)
      } else {
        await createMember(toCreateMemberDto(values))
        toast.success(`${values.name} se sumó al equipo`)
      }

      return "saved"
    } catch (error) {
      // Un 409 sin mensaje es el email repetido: lo corrige quien guarda, en el campo. Cualquier otro fallo
      // (incluido el 409 de "último administrador", que sí trae mensaje) se avisa acá.
      if (isHttpFailure(error) && error.status === 409 && !error.backendMessage) return "email-taken"

      toast.error(getHttpErrorMessage(error))

      return "failed"
    }
  }

  async function handleToggle(member: TeamMember, active: boolean) {
    try {
      await setActive({ id: member.id, active })
      toast.success(`${member.name} ${active ? "activado" : "desactivado"}`)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  async function handleRemove() {
    if (!memberToRemove) return

    try {
      await removeMember(memberToRemove.id)
      toast.success("Miembro eliminado del equipo")
      setMemberToRemove(null)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <TeamHeader seatsUsed={members?.length} plan={plan} onAdd={() => openDialog(null)} />

      <MemberTable
        members={members}
        isPending={isPending}
        isError={isError}
        isToggling={isToggling}
        onToggle={(member, active) => void handleToggle(member, active)}
        onEdit={openDialog}
        onRemove={setMemberToRemove}
      />

      <MemberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        member={editingMember}
        isRoleLocked={Boolean(members && editingMember && isLastActiveAdmin(members, editingMember))}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={memberToRemove !== null}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        title="Quitar miembro"
        description={`¿Quitar a ${memberToRemove?.name ?? ""} del equipo? Dejará de tener acceso y libera un puesto de tu plan.`}
        confirmLabel="Quitar"
        destructive
        isPending={isRemoving}
        onConfirm={() => void handleRemove()}
      />
    </div>
  )
}
