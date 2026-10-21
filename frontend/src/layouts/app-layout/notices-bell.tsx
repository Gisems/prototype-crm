import { Bell, Info, Sparkles, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useMarkAllNoticesRead, useMarkNoticeRead } from "core/hooks/mutation/use-mutation-notice"
import { useNotices } from "core/hooks/query/use-query-notice"
import type { NoticeKind } from "core/models/notice"
import { Button } from "shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "shared/components/ui/popover"
import { Skeleton } from "shared/components/ui/skeleton"
import { formatDate } from "shared/utils/date"

const KIND_VISUALS: Record<NoticeKind, { icon: LucideIcon; className: string }> = {
  maintenance: { icon: Wrench, className: "bg-warning/15 text-warning" },
  update: { icon: Sparkles, className: "bg-primary/10 text-primary" },
  info: { icon: Info, className: "bg-muted text-muted-foreground" },
}

/** Pasado este número el contador dice "9+": un círculo chico no entra con más dígitos. */
const MAX_BADGE = 9

/**
 * La campana de avisos: los comunicados que la empresa envía a quienes administran la cuenta (mantenimientos,
 * novedades). Cuando exista el manejo de roles, solo se muestra a los administradores.
 */
export function NoticesBell() {
  const { data: notices, isPending, isError } = useNotices()
  const { mutate: markRead } = useMarkNoticeRead()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNoticesRead()

  const unread = notices?.filter((notice) => !notice.read).length ?? 0

  return (
    <Popover>
      <PopoverTrigger
        aria-label={unread > 0 ? `Avisos: ${unread} sin leer` : "Avisos"}
        className="relative flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted"
      >
        <Bell className="size-6" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-4.5 font-bold text-accent-foreground"
          >
            {unread > MAX_BADGE ? `${MAX_BADGE}+` : unread}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-[min(26rem,calc(100vw-2rem))] gap-0 p-0">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <h2 className="font-bold">Avisos</h2>
          {unread > 0 && (
            <Button type="button" variant="ghost" size="sm" disabled={isMarkingAll} onClick={() => markAllRead()}>
              Marcar todos como leídos
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isPending && (
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
          )}

          {isError && <p className="p-4 text-sm text-destructive">No pudimos cargar los avisos.</p>}

          {notices?.length === 0 && <p className="p-4 text-sm text-muted-foreground">No hay avisos por ahora.</p>}

          <ul className="divide-y">
            {notices?.map((notice) => {
              const { icon: Icon, className } = KIND_VISUALS[notice.kind]

              return (
                <li key={notice.id}>
                  <button
                    type="button"
                    onClick={() => !notice.read && markRead(notice.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                      notice.read ? "" : "bg-primary/5"
                    }`}
                  >
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${className}`}>
                      <Icon className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className={`text-sm ${notice.read ? "font-medium" : "font-bold"}`}>{notice.title}</span>
                      <span className="text-sm text-muted-foreground">{notice.message}</span>
                      <span className="mt-1 text-xs text-muted-foreground">{formatDate(notice.createdAt)}</span>
                    </span>
                    {!notice.read && (
                      <span aria-label="Sin leer" className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}
