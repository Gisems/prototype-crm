import { LayoutGrid, List, Plus, Search, Upload } from "lucide-react"

import { ITEM_TYPES, type ItemType } from "core/models/product"
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

import { ITEM_TYPE_LABELS } from "../../components/item-labels"
import { CATALOG_VIEWS, type CatalogView } from "./catalog-view"

const TYPE_ITEMS = { all: "Todos los tipos", ...ITEM_TYPE_LABELS }

const VIEW_OPTIONS = {
  cards: { label: "Ver como tarjetas", icon: LayoutGrid },
  list: { label: "Ver como filas", icon: List },
} as const

interface CatalogToolbarProps {
  view: CatalogView
  query: string
  type: ItemType | "all"
  onViewChange: (view: CatalogView) => void
  onQueryChange: (query: string) => void
  onTypeChange: (type: ItemType | "all") => void
  onCreate: () => void
  onImport: () => void
}

export function CatalogToolbar({
  view,
  query,
  type,
  onViewChange,
  onQueryChange,
  onTypeChange,
  onCreate,
  onImport,
}: Readonly<CatalogToolbarProps>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <fieldset className="flex gap-1">
          <legend className="sr-only">Vista del catálogo</legend>
          {CATALOG_VIEWS.map((option) => {
            const { label, icon: Icon } = VIEW_OPTIONS[option]

            return (
              <Button
                key={option}
                variant={view === option ? "default" : "outline"}
                size="icon"
                aria-label={label}
                aria-pressed={view === option}
                title={label}
                onClick={() => onViewChange(option)}
              >
                <Icon />
              </Button>
            )
          })}
        </fieldset>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nombre o SKU"
            aria-label="Buscar por nombre o SKU"
            className="w-64 pl-8"
          />
        </div>

        <Select value={type} items={TYPE_ITEMS} onValueChange={(next) => onTypeChange(next as ItemType | "all")}>
          <SelectTrigger className="w-44" aria-label="Filtrar por tipo">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {ITEM_TYPES.map((item) => (
              <SelectItem key={item} value={item}>
                {ITEM_TYPE_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="action" onClick={onImport}>
          <Upload /> Importar catálogo
        </Button>
        <Button onClick={onCreate} variant="accent">
          <Plus /> Crear ítem
        </Button>
      </div>
    </div>
  )
}
