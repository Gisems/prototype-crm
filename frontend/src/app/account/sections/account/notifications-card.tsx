import type { Notifications } from "core/models/profile"
import { Switch } from "shared/components/ui/switch"

const ITEMS: { key: keyof Notifications; label: string }[] = [
  { key: "assigned", label: "Nuevo mensaje asignado a mí" },
  { key: "mention", label: "Mención en una nota" },
  { key: "digest", label: "Resumen diario por email" },
  { key: "sound", label: "Sonido al recibir un mensaje" },
]

interface NotificationsCardProps {
  notifications: Notifications
  onToggle: (key: keyof Notifications, enabled: boolean) => void
}

export function NotificationsCard({ notifications, onToggle }: Readonly<NotificationsCardProps>) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="mb-2 text-lg font-bold">Notificaciones</h2>

      <ul className="divide-y">
        {ITEMS.map(({ key, label }) => (
          <li key={key} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span>{label}</span>
            <Switch
              checked={notifications[key]}
              aria-label={label}
              onCheckedChange={(enabled) => onToggle(key, enabled)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
