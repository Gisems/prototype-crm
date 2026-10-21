import { z } from "zod"

export const channelSchema = z.object({
  /** `wa`, `ig`, `fb`: identifica el tipo de canal. */
  id: z.string(),
  name: z.string(),
  /** La cuenta vinculada (número, usuario o página), o una pista de cómo conectarla. */
  detail: z.string(),
  connected: z.boolean(),
  botEnabled: z.boolean(),
  /** El flujo que atiende el bot en este canal. */
  flowId: z.string().nullable(),
})

export type Channel = z.infer<typeof channelSchema>
