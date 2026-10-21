import { z } from "zod"

/** Los roles que se pueden asignar al dar de alta a alguien. Cuando exista el manejo de permisos, cada uno los definirá. */
export const MEMBER_ROLES = ["Administrador", "Agente de ventas", "Soporte", "Solo lectura"] as const

export const teamMemberSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  /** Texto libre por ahora: pasa a ser un enum cuando exista el manejo de roles. */
  role: z.string(),
  active: z.boolean(),
})

export type TeamMember = z.infer<typeof teamMemberSchema>
