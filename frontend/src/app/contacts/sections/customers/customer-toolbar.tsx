import { Plus, Search } from "lucide-react"

import { CUSTOMER_CHANNELS, CUSTOMER_STAGES, type CustomerChannel, type CustomerStage } from "core/models/customer"
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

import { CHANNEL_LABELS, STAGE_LABELS } from "./customer-visuals"

/** Valor del selector de etiqueta para "todas". */
const ALL = "all"

const STAGE_ITEMS = { all: "Todas las etapas", ...STAGE_LABELS }

const CHANNEL_ITEMS = { all: "Todos los canales", ...CHANNEL_LABELS }

interface CustomerToolbarProps {
  query: string
  stage: CustomerStage | "all"
  channel: CustomerChannel | "all"
  tag: string
  /** Las etiquetas que existen entre los clientes. */
  tags: string[]
  onQueryChange: (query: string) => void
  onStageChange: (stage: CustomerStage | "all") => void
  onChannelChange: (channel: CustomerChannel | "all") => void
  onTagChange: (tag: string) => void
  onCreate: () => void
}

export function CustomerToolbar({
  query,
  stage,
  channel,
  tag,
  tags,
  onQueryChange,
  onStageChange,
  onChannelChange,
  onTagChange,
  onCreate,
}: Readonly<CustomerToolbarProps>) {
  const tagItems = { [ALL]: "Todas las etiquetas", ...Object.fromEntries(tags.map((item) => [item, item])) }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nombre o teléfono"
            aria-label="Buscar cliente por nombre o teléfono"
            className="w-64 pl-8"
          />
        </div>

        <Select
          value={channel}
          items={CHANNEL_ITEMS}
          onValueChange={(next) => onChannelChange(next as CustomerChannel | "all")}
        >
          <SelectTrigger className="w-44" aria-label="Filtrar por canal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {CUSTOMER_CHANNELS.map((item) => (
              <SelectItem key={item} value={item}>
                {CHANNEL_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stage}
          items={STAGE_ITEMS}
          onValueChange={(next) => onStageChange(next as CustomerStage | "all")}
        >
          <SelectTrigger className="w-44" aria-label="Filtrar por etapa">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las etapas</SelectItem>
            {CUSTOMER_STAGES.map((item) => (
              <SelectItem key={item} value={item}>
                {STAGE_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tag || ALL}
          items={tagItems}
          onValueChange={(next) => onTagChange(next === ALL || next === null ? "" : next)}
        >
          <SelectTrigger className="w-48" aria-label="Filtrar por etiqueta">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las etiquetas</SelectItem>
            {tags.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="button" variant="accent" onClick={onCreate}>
        <Plus /> Nuevo cliente
      </Button>
    </div>
  )
}
