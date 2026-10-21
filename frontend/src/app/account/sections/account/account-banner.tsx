import type { Profile, ProfileStatus } from "core/models/profile"
import { PageBanner } from "shared/components/custom/page-banner"
import { UserAvatar } from "shared/components/custom/user-avatar"

const STATUS_OPTIONS: { value: ProfileStatus; label: string; dotClassName: string }[] = [
  { value: "available", label: "Disponible", dotClassName: "bg-success" },
  { value: "away", label: "Ausente", dotClassName: "bg-muted-foreground/60" },
]

interface AccountBannerProps {
  profile: Profile
  onStatusChange: (status: ProfileStatus) => void
}

/** Quién eres y si estás disponible; el estado también se ve al pie del menú lateral. */
export function AccountBanner({ profile, onStatusChange }: Readonly<AccountBannerProps>) {
  return (
    <PageBanner>
      <div className="flex min-w-0 items-center gap-4">
        <UserAvatar name={profile.name} tone={profile.avatarColor} className="size-14 text-lg ring-2 ring-white/60" />
        <div className="min-w-0">
          <h2 className="truncate text-3xl leading-tight font-bold">{profile.name}</h2>
          <p className="truncate text-sm text-white/80">{profile.email}</p>
        </div>
      </div>

      <fieldset className="flex gap-1 rounded-full bg-white/15 p-1 md:ml-auto">
        <legend className="sr-only">Tu estado</legend>
        {STATUS_OPTIONS.map(({ value, label, dotClassName }) => {
          const isActive = profile.status === value

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStatusChange(value)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "bg-white text-primary shadow-sm" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span aria-hidden="true" className={`size-2 rounded-full ${dotClassName}`} />
              {label}
            </button>
          )
        })}
      </fieldset>
    </PageBanner>
  )
}
