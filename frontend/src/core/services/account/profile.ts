import { type Profile, profileSchema, type UpdateProfileDto } from "core/models/profile"

/**
 * MOCK: el perfil de quien inició sesión, en memoria: los cambios se pierden al recargar. Es la misma persona
 * que `core/services/auth` (el correo del login demo). Cuando exista el backend, cada método pasa a `crmClient`.
 */
let mockProfile: Profile = {
  name: "Equipo G2I",
  email: "info@g2i.com",
  avatarColor: "primary",
  status: "available",
  notifications: { assigned: true, mention: true, digest: false, sound: true },
}

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createProfileService() {
  return {
    async get(): Promise<Profile> {
      await delay(300)

      return profileSchema.parse(mockProfile)
    },

    async update({ notifications, ...changes }: UpdateProfileDto): Promise<Profile> {
      await delay(300)

      mockProfile = profileSchema.parse({
        ...mockProfile,
        ...changes,
        notifications: { ...mockProfile.notifications, ...notifications },
      })

      return mockProfile
    },
  }
}
