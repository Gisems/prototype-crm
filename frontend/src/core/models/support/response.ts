import { z } from "zod"

/** De qué parte del producto habla la pregunta: sirve para filtrar y para llevar a la sección correspondiente. */
export const faqTopicSchema = z.enum(["channels", "plan", "team", "bots", "reports"])

export type FaqTopic = z.infer<typeof faqTopicSchema>

export const faqSchema = z.object({
  id: z.number().int(),
  topic: faqTopicSchema,
  question: z.string(),
  answer: z.string(),
})

export type Faq = z.infer<typeof faqSchema>

export const ticketSchema = z.object({
  id: z.number().int(),
  subject: z.string(),
  message: z.string(),
  /** ISO en UTC con `Z`: se formatea al mostrarlo. */
  createdAt: z.iso.datetime(),
})

export type Ticket = z.infer<typeof ticketSchema>
