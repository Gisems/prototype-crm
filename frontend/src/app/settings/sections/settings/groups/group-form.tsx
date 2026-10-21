import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { emptyGroupFormInput, type GroupFormInput, type GroupFormValues, groupFormSchema } from "core/models/group"
import type { TeamMember } from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

import { ScheduleEditor } from "./schedule-editor"

interface GroupFormProps {
  /** Los valores del grupo que se edita; sin ellos el formulario empieza vacío, para crear. */
  initial?: GroupFormInput
  /** Todo el equipo: los miembros del grupo se eligen de acá. */
  members: TeamMember[]
  submitLabel: string
  submittingLabel: string
  /** Resuelve `true` si se guardó; entonces el formulario se cierra. */
  onSubmit: (values: GroupFormValues) => Promise<boolean>
  onCancel: () => void
}

export function GroupForm({
  initial = emptyGroupFormInput,
  members,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: Readonly<GroupFormProps>) {
  const form = useForm<GroupFormInput, unknown, GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: initial,
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          if (await onSubmit(values)) onCancel()
        })}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del grupo</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Ej: Vendedores" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miembros</FormLabel>
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">Agrega miembros al equipo primero.</p>
              ) : (
                <ul className="max-h-40 divide-y overflow-y-auto rounded-lg border">
                  {members.map((member) => (
                    <li key={member.id}>
                      <label className="flex items-center gap-2 px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={field.value.includes(member.id)}
                          onChange={(event) =>
                            field.onChange(
                              event.target.checked
                                ? [...field.value, member.id]
                                : field.value.filter((id) => id !== member.id),
                            )
                          }
                          className="size-4 accent-primary"
                        />
                        {member.name}
                        {!member.active && <span className="text-xs text-muted-foreground">(inactivo)</span>}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Horario de atención</span>
          <ScheduleEditor form={form} />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="action" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="accent">
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
