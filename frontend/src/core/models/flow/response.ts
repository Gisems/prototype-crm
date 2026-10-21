import { z } from "zod"

export const flowStatusSchema = z.enum(["published", "draft"])

export const flowSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: flowStatusSchema,
})

export type Flow = z.infer<typeof flowSchema>
