import type { Product, ProductSort } from "core/models/product"
import { Skeleton } from "shared/components/ui/skeleton"

import type { CatalogView } from "./catalog-view"
import { ProductCard } from "./product-card"
import { ProductTable } from "./product-table"

interface CatalogContentProps {
  view: CatalogView
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
  products: Product[] | undefined
  /** Hay una búsqueda activa: una lista vacía significa "sin coincidencias", no "catálogo vacío". */
  hasFilters: boolean
  isPending: boolean
  isError: boolean
}

const SKELETON_COUNT = 4
const CARDS_GRID = "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4"

function CatalogSkeleton({ view }: Readonly<{ view: CatalogView }>) {
  const items = Array.from({ length: SKELETON_COUNT }, (_, index) => index)

  if (view === "list") {
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Skeleton key={item} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className={CARDS_GRID}>
      {items.map((item) => (
        <Skeleton key={item} className="h-72 rounded-lg" />
      ))}
    </div>
  )
}

export function CatalogContent({
  view,
  sort,
  onSortChange,
  products,
  hasFilters,
  isPending,
  isError,
}: Readonly<CatalogContentProps>) {
  if (isPending) return <CatalogSkeleton view={view} />

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar el catálogo. Intenta de nuevo.</p>

  if (!products?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {hasFilters ? "No hay ítems que coincidan con la búsqueda." : "Todavía no hay ítems en el catálogo."}
      </p>
    )
  }

  if (view === "list") return <ProductTable products={products} sort={sort} onSortChange={onSortChange} />

  return (
    <div className={CARDS_GRID}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
