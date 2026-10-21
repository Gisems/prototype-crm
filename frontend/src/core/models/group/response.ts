import { z } from "zod"

import { scheduleSchema } from "./schedule"

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Ids de los miembros del equipo; si alguien se quita del equipo, el grupo deja de mostrarlo. */
  memberIds: z.array(z.number().int()),
  schedule: scheduleSchema,
})

export type Group = z.infer<typeof groupSchema>
