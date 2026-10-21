import { PageNav } from "shared/components/custom/page-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

import { PAGE_SIZES, type PageSize } from "./catalog-view"

const PAGE_SIZE_ITEMS = Object.fromEntries(PAGE_SIZES.map((size) => [String(size), String(size)]))

interface CatalogPagerProps {
  /** Para distinguir las dos paginaciones (arriba y abajo) ante un lector de pantalla. */
  position: "superior" | "inferior"
  /** Cuántos ítems se ven en esta página. */
  shown: number
  /** Cuántos hay en total, con la búsqueda aplicada. */
  total: number
  hasFilters: boolean
  page: number
  pageCount: number
  pageSize: PageSize
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

export function CatalogPager({
  position,
  shown,
  total,
  hasFilters,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Readonly<CatalogPagerProps>) {
  return (
    <nav aria-label={`Paginación ${position}`} className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground">
        {shown} de {total} ítems{hasFilters && " (filtrados)"}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Por página</span>
          <Select
            value={String(pageSize)}
            items={PAGE_SIZE_ITEMS}
            onValueChange={(next) => onPageSizeChange(Number(next) as PageSize)}
          >
            <SelectTrigger size="sm" className="w-20" aria-label="Ítems por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PageNav page={page} pageCount={pageCount} onPageChange={onPageChange} />
      </div>
    </nav>
  )
}
