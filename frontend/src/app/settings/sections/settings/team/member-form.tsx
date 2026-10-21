import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  emptyMemberFormInput,
  MEMBER_ROLES,
  type MemberFormInput,
  type MemberFormValues,
  memberFormSchema,
} from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

/** `email-taken` se muestra en el campo email; `failed` ya lo avisó quien llama con un toast. */
export type MemberResult = "saved" | "email-taken" | "failed"

interface MemberFormProps {
  /** Los valores de quien se edita; sin ellos el formulario empieza vacío, para agregar. */
  initial?: MemberFormInput
  submitLabel: string
  submittingLabel: string
  /** El rol no se puede cambiar: es el último administrador activo. */
  isRoleLocked?: boolean
  onSubmit: (values: MemberFormValues) => Promise<MemberResult>
  onCancel: () => void
}

export function MemberForm({
  initial = emptyMemberFormInput,
  submitLabel,
  submittingLabel,
  isRoleLocked = false,
  onSubmit,
  onCancel,
}: Readonly<MemberFormProps>) {
  const form = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: initial,
  })
  const { isSubmitting } = form.formState

  async function handleSubmit(values: MemberFormValues) {
    const result = await onSubmit(values)

    if (result === "saved") onCancel()
    else if (result === "email-taken") form.setError("email", { message: "Ya hay un miembro con ese email" })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Ej: Diego Fernández" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="off" placeholder="Ej: diego@chatg2i.uy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select value={field.value} disabled={isRoleLocked} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MEMBER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isRoleLocked && (
                <p className="text-xs text-muted-foreground">
                  Es el último administrador activo: su rol no se puede cambiar.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

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
