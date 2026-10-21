import { useNavigate } from "react-router"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useChangePassword, useSignOut } from "core/hooks/mutation/use-mutation-auth"
import { useUpdateProfile } from "core/hooks/mutation/use-mutation-profile"
import { useProfile } from "core/hooks/query/use-query-profile"
import { isHttpFailure } from "core/lib/client/failure"
import { type PasswordFormValues, toChangePasswordDto } from "core/models/auth"
import type {
  AvatarColor,
  Notifications,
  ProfileFormValues,
  ProfileStatus,
  UpdateProfileDto,
} from "core/models/profile"
import { PATHS } from "router/paths"
import { Skeleton } from "shared/components/ui/skeleton"

import { AccountBanner } from "../sections/account/account-banner"
import { NotificationsCard } from "../sections/account/notifications-card"
import { PasswordCard, type PasswordResult } from "../sections/account/password-card"
import { ProfileCard } from "../sections/account/profile-card"
import { SessionCard } from "../sections/account/session-card"

export const handle = {
  title: "Mi cuenta",
  description: "Tu perfil, contraseña y preferencias de notificación",
}

export default function AccountPage() {
  const navigate = useNavigate()
  const signOut = useSignOut()
  const { data: profile, isError } = useProfile()
  const { mutateAsync: updateProfile } = useUpdateProfile()
  const { mutateAsync: changePassword } = useChangePassword()

  /** Guarda un cambio del perfil; resuelve `true` si salió bien. Los avisos van por toast. */
  async function save(dto: UpdateProfileDto, message: string) {
    try {
      await updateProfile(dto)
      toast.success(message)

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleChangePassword(values: PasswordFormValues): Promise<PasswordResult> {
    try {
      await changePassword(toChangePasswordDto(values))
      toast.success("Contraseña actualizada")

      return "changed"
    } catch (error) {
      // Un 400 con mensaje es la contraseña actual mal escrita: se muestra en su campo, no como aviso.
      if (isHttpFailure(error) && error.status === 400) return "wrong-password"

      toast.error(getHttpErrorMessage(error))

      return "failed"
    }
  }

  async function handleSignOut() {
    await signOut()
    void navigate(PATHS.LOGIN, { replace: true })
  }

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar tu cuenta. Intenta de nuevo.</p>

  if (!profile) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-26 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AccountBanner
        profile={profile}
        onStatusChange={(status: ProfileStatus) =>
          void save({ status }, status === "available" ? "Ahora estás disponible" : "Ahora estás ausente")
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProfileCard
            // Al cambiar los datos guardados, el formulario se reinicia con ellos.
            key={`${profile.name}|${profile.email}`}
            profile={profile}
            onSave={(values: ProfileFormValues) => save(values, "Datos actualizados")}
            onAvatarColorChange={(avatarColor: AvatarColor) =>
              void save({ avatarColor }, "Color de avatar actualizado")
            }
          />
          <SessionCard onSignOut={() => void handleSignOut()} />
        </div>

        <div className="flex flex-col gap-6">
          <PasswordCard onSubmit={handleChangePassword} />
          <NotificationsCard
            notifications={profile.notifications}
            onToggle={(key: keyof Notifications, enabled) =>
              void save({ notifications: { [key]: enabled } }, "Preferencia guardada")
            }
          />
        </div>
      </div>
    </div>
  )
}
