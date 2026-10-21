import { z } from "zod"

import { requiredString } from "shared/utils/schema"

import type { Group } from "./response"
import { DAYS, type Schedule, scheduleSchema } from "./schedule"

export const groupFormSchema = z.object({
  name: requiredString(60),
  memberIds: z.array(z.number().int()),
  schedule: scheduleSchema.superRefine((schedule, ctx) => {
    // Un día activo con la hora de cierre antes de la de apertura no atiende nunca.
    for (const { key } of DAYS) {
      const day = schedule[key]

      if (day.active && day.to <= day.from) {
        ctx.addIssue({ code: "custom", path: [key, "to"], message: "Debe terminar después de empezar" })
      }
    }
  }),
})

export type GroupFormInput = z.input<typeof groupFormSchema>
export type GroupFormValues = z.output<typeof groupFormSchema>

const EMPTY_SCHEDULE = Object.fromEntries(
  DAYS.map(({ key }) => [key, { active: false, from: "09:00", to: "18:00" }]),
) as Schedule

export const emptyGroupFormInput: GroupFormInput = { name: "", memberIds: [], schedule: EMPTY_SCHEDULE }

export function toGroupFormInput(group: Group): GroupFormInput {
  return { name: group.name, memberIds: group.memberIds, schedule: group.schedule }
}
