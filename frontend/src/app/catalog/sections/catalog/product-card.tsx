import { Link } from "react-router"

import type { Product } from "core/models/product"
import { PATHS } from "router/paths"

import { formatItemPrice, itemDetail, itemStatus } from "../../components/item-labels"
import { ProductImage } from "../../components/product-image"

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  const status = itemStatus(product)

  return (
    <Link
      to={PATHS.CATALOG.detail(product.sku)}
      className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ProductImage image={product.image} alt={product.name} className="h-40 w-full" />
      <div className="flex flex-1 flex-col gap-1 px-4 py-3">
        <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{product.sku}</p>
        <h3 className="text-sm font-bold">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{itemDetail(product)}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="font-bold text-primary">{formatItemPrice(product)}</p>
          <p className={`text-xs ${status.className}`}>{status.label}</p>
        </div>
      </div>
    </Link>
  )
}
