import type { AvatarColor, Notifications, ProfileStatus } from "./response"

/** Cualquier parte del perfil que cambie: lo que no viaja, no se toca. */
export interface UpdateProfileDto {
  name?: string
  email?: string
  avatarColor?: AvatarColor
  status?: ProfileStatus
  notifications?: Partial<Notifications>
}
