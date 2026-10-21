import { z } from "zod"

import { requiredString } from "shared/utils/schema"

import { MEMBER_ROLES, type TeamMember } from "./response"

export const memberFormSchema = z.object({
  name: requiredString(100),
  email: requiredString(120)
    .pipe(z.email({ error: "Correo inválido" }))
    .transform((email) => email.toLowerCase()),
  role: z.enum(MEMBER_ROLES),
})

export type MemberFormInput = z.input<typeof memberFormSchema>
export type MemberFormValues = z.output<typeof memberFormSchema>

export const emptyMemberFormInput: MemberFormInput = { name: "", email: "", role: "Agente de ventas" }

/** El rol es texto libre en el modelo; si no es uno de la lista, el selector arranca en el primero. */
export function toMemberFormInput(member: TeamMember): MemberFormInput {
  const role = MEMBER_ROLES.find((item) => item === member.role) ?? MEMBER_ROLES[0]

  return { name: member.name, email: member.email, role }
}
