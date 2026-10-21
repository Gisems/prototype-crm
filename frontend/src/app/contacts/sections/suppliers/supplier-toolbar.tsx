import { Plus, Search } from "lucide-react"

import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"

interface SupplierToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  onCreate: () => void
}

export function SupplierToolbar({ query, onQueryChange, onCreate }: Readonly<SupplierToolbarProps>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por empresa, contacto o rubro"
          aria-label="Buscar proveedor por empresa, contacto o rubro"
          className="w-80 pl-8"
        />
      </div>

      <Button type="button" variant="accent" onClick={onCreate}>
        <Plus /> Nuevo proveedor
      </Button>
    </div>
  )
}
