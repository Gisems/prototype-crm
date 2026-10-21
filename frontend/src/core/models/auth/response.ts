import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
})

export type User = z.infer<typeof userSchema>

export const signInResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
})

export type SignInResponse = z.infer<typeof signInResponseSchema>
