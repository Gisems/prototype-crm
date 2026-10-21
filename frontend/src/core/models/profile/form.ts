import { z } from "zod"

import { requiredString } from "shared/utils/schema"

import type { Profile } from "./response"

export const profileFormSchema = z.object({
  name: requiredString(100),
  email: requiredString(120)
    .pipe(z.email({ error: "Correo inválido" }))
    .transform((email) => email.toLowerCase()),
})

export type ProfileFormInput = z.input<typeof profileFormSchema>
export type ProfileFormValues = z.output<typeof profileFormSchema>

export function toProfileFormInput({ name, email }: Profile): ProfileFormInput {
  return { name, email }
}
