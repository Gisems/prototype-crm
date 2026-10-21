import { z } from "zod"

/** Qué tipo de aviso es: sirve para el ícono y el color con que se muestra. */
export const NOTICE_KINDS = ["maintenance", "update", "info"] as const

export const noticeSchema = z.object({
  id: z.number().int(),
  kind: z.enum(NOTICE_KINDS),
  title: z.string(),
  message: z.string(),
  /** ISO en UTC con `Z`: se formatea al mostrarlo. */
  createdAt: z.iso.datetime(),
  /** Si quien mira ya lo leyó. */
  read: z.boolean(),
})

export type Notice = z.infer<typeof noticeSchema>
export type NoticeKind = (typeof NOTICE_KINDS)[number]
