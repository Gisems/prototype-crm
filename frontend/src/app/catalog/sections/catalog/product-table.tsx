import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Link } from "react-router"

import { nextSort, type Product, type ProductSort, type ProductSortColumn, sortDirection } from "core/models/product"
import { PATHS } from "router/paths"
import { Button } from "shared/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "shared/components/ui/table"

import { formatItemPrice, ITEM_TYPE_LABELS, itemDetail, itemStatus } from "../../components/item-labels"
import { ProductImage } from "../../components/product-image"

const SORT_ICON = { asc: ArrowUp, desc: ArrowDown } as const

const ARIA_SORT = { asc: "ascending", desc: "descending" } as const

interface SortableHeadProps {
  label: string
  column: ProductSortColumn
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
  className?: string
}

function SortableHead({ label, column, sort, onSortChange, className }: Readonly<SortableHeadProps>) {
  const direction = sortDirection(sort, column)
  const Icon = direction ? SORT_ICON[direction] : ArrowUpDown

  return (
    <TableHead className={`text-right ${className ?? ""}`} aria-sort={direction ? ARIA_SORT[direction] : "none"}>
      <Button variant="ghost" size="sm" className="-mr-2.5" onClick={() => onSortChange(nextSort(sort, column))}>
        {label}
        <Icon className={direction ? "" : "opacity-40"} />
      </Button>
    </TableHead>
  )
}

interface ProductTableProps {
  products: Product[]
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
}

export function ProductTable({ products, sort, onSortChange }: Readonly<ProductTableProps>) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Detalle</TableHead>
            <SortableHead label="Precio" column="price" sort={sort} onSortChange={onSortChange} />
            <SortableHead label="Stock" column="stock" sort={sort} onSortChange={onSortChange} className="pr-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const status = itemStatus(product)

            return (
              <TableRow key={product.id} className="relative">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <ProductImage image={product.image} alt={product.name} className="size-12 shrink-0 rounded-md" />
                    <div className="min-w-0">
                      <Link
                        to={PATHS.CATALOG.detail(product.sku)}
                        className="font-semibold after:absolute after:inset-0 hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">{product.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>{ITEM_TYPE_LABELS[product.type]}</TableCell>
                <TableCell>{itemDetail(product)}</TableCell>
                <TableCell className="text-right font-bold text-primary">{formatItemPrice(product)}</TableCell>
                <TableCell className={`pr-4 text-right ${status.className}`}>{product.stock ?? "—"}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
