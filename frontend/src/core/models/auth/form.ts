import { z } from "zod"

import { requiredString, whenValid } from "shared/utils/schema"

export const signInFormSchema = z.object({
  email: requiredString().pipe(z.email({ error: "Correo inválido" })),
  password: requiredString(),
})

export type SignInFormInput = z.input<typeof signInFormSchema>
export type SignInFormValues = z.output<typeof signInFormSchema>

export const passwordFormSchema = z
  .object({
    currentPassword: requiredString(),
    newPassword: requiredString().pipe(z.string().min(6, "Debe tener al menos 6 caracteres")),
    confirmPassword: requiredString(),
  })
  .superRefine(
    ({ currentPassword, newPassword }, ctx) => {
      if (newPassword === currentPassword) {
        ctx.addIssue({ code: "custom", path: ["newPassword"], message: "Debe ser distinta de la actual" })
      }
    },
    whenValid("currentPassword", "newPassword"),
  )
  .superRefine(
    ({ newPassword, confirmPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Las contraseñas no coinciden" })
      }
    },
    whenValid("newPassword", "confirmPassword"),
  )

export type PasswordFormInput = z.input<typeof passwordFormSchema>
export type PasswordFormValues = z.output<typeof passwordFormSchema>

export const emptyPasswordFormInput: PasswordFormInput = { currentPassword: "", newPassword: "", confirmPassword: "" }
