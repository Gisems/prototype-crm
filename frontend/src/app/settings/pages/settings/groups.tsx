import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateGroup, useRemoveGroup, useUpdateGroup } from "core/hooks/mutation/use-mutation-group"
import { useGroups } from "core/hooks/query/use-query-group"
import { useTeamMembers } from "core/hooks/query/use-query-team"
import { type Group, type GroupFormValues, toSaveGroupDto } from "core/models/group"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"
import { Button } from "shared/components/ui/button"
import { Skeleton } from "shared/components/ui/skeleton"
import { useNow } from "shared/hooks/use-now"

import { GroupCard } from "../../sections/settings/groups/group-card"
import { GroupDialog } from "../../sections/settings/groups/group-dialog"

/** Cada cuánto se revisa si un grupo entró o salió de su horario. */
const CLOCK_INTERVAL_MS = 60_000

export default function GroupsTab() {
  // El mismo diálogo crea y edita: `editingGroup` es cuál se edita, o `null` para crear.
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
  const now = useNow(CLOCK_INTERVAL_MS)
  const { data: groups, isPending, isError } = useGroups()
  const { data: members } = useTeamMembers()
  const { mutateAsync: createGroup } = useCreateGroup()
  const { mutateAsync: updateGroup } = useUpdateGroup()
  const { mutateAsync: removeGroup, isPending: isRemoving } = useRemoveGroup()

  function openDialog(group: Group | null) {
    setEditingGroup(group)
    setIsDialogOpen(true)
  }

  async function handleSubmit(values: GroupFormValues) {
    try {
      if (editingGroup) {
        await updateGroup({ id: editingGroup.id, dto: toSaveGroupDto(values) })
        toast.success("Grupo actualizado")
      } else {
        await createGroup(toSaveGroupDto(values))
        toast.success("Grupo creado")
      }

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleDelete() {
    if (!groupToDelete) return

    try {
      await removeGroup(groupToDelete.id)
      toast.success("Grupo eliminado")
      setGroupToDelete(null)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Grupos de atención</h2>
        <Button
          type="button"

          onClick={() => openDialog(null)}
          variant="accent"
        >
          <Plus /> Nuevo grupo
        </Button>
      </div>

      {isPending && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      )}

      {isError && <p className="text-sm text-destructive">No pudimos cargar los grupos. Intenta de nuevo.</p>}

      {groups?.length === 0 && <p className="text-sm text-muted-foreground">Todavía no creaste ningún grupo.</p>}

      {groups && groups.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              // Quien se quitó del equipo deja de aparecer en el grupo, aunque su id siga guardado.
              members={(members ?? []).filter((member) => group.memberIds.includes(member.id))}
              now={now}
              onEdit={() => openDialog(group)}
              onDelete={() => setGroupToDelete(group)}
            />
          ))}
        </div>
      )}

      <GroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        group={editingGroup}
        members={members ?? []}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={groupToDelete !== null}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
        title="Eliminar grupo"
        description={`¿Eliminar el grupo «${groupToDelete?.name ?? ""}»? Sus miembros siguen en el equipo.`}
        confirmLabel="Eliminar"
        destructive
        isPending={isRemoving}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
