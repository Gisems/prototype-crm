import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  emptyPasswordFormInput,
  type PasswordFormInput,
  type PasswordFormValues,
  passwordFormSchema,
} from "core/models/auth"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

/** `wrong-password` se muestra en el campo de la contraseña actual; `failed` ya lo avisó quien llama con un toast. */
export type PasswordResult = "changed" | "wrong-password" | "failed"

const FIELDS = [
  { name: "currentPassword", label: "Contraseña actual", autoComplete: "current-password", placeholder: "••••••••" },
  { name: "newPassword", label: "Nueva contraseña", autoComplete: "new-password", placeholder: "Mínimo 6 caracteres" },
  { name: "confirmPassword", label: "Confirmar nueva contraseña", autoComplete: "new-password", placeholder: "" },
] as const

export function PasswordCard({
  onSubmit,
}: Readonly<{ onSubmit: (values: PasswordFormValues) => Promise<PasswordResult> }>) {
  const form = useForm<PasswordFormInput, unknown, PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: emptyPasswordFormInput,
  })
  const { isSubmitting } = form.formState

  return (
    <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Cambiar contraseña</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const result = await onSubmit(values)

            if (result === "changed") form.reset()
            else if (result === "wrong-password") {
              form.setError("currentPassword", { message: "La contraseña actual no es correcta" })
            }
          })}
          className="flex flex-col gap-4"
        >
          {FIELDS.map(({ name, label, autoComplete, placeholder }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete={autoComplete} placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" disabled={isSubmitting} className="self-start" variant="accent">
            {isSubmitting ? "Actualizando…" : "Actualizar contraseña"}
          </Button>
        </form>
      </Form>
    </section>
  )
}
