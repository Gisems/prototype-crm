import { z } from "zod"

/** Colores que se pueden elegir para el avatar; la vista decide cómo se pinta cada uno. */
export const AVATAR_COLORS = ["primary", "accent", "secondary", "primary-light", "accent-light"] as const

export const avatarColorSchema = z.enum(AVATAR_COLORS)

export type AvatarColor = z.infer<typeof avatarColorSchema>

export const profileStatusSchema = z.enum(["available", "away"])

export type ProfileStatus = z.infer<typeof profileStatusSchema>

export const notificationsSchema = z.object({
  /** Un mensaje nuevo asignado a mí. */
  assigned: z.boolean(),
  /** Me mencionan en una nota. */
  mention: z.boolean(),
  /** Resumen diario por email. */
  digest: z.boolean(),
  /** Sonido al recibir un mensaje. */
  sound: z.boolean(),
})

export type Notifications = z.infer<typeof notificationsSchema>

export const profileSchema = z.object({
  name: z.string(),
  email: z.string(),
  avatarColor: avatarColorSchema,
  status: profileStatusSchema,
  notifications: notificationsSchema,
})

export type Profile = z.infer<typeof profileSchema>
