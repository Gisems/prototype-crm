import { useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateProduct } from "core/hooks/mutation/use-mutation-product"
import { useProducts } from "core/hooks/query/use-query-product"
import { isHttpFailure } from "core/lib/client/failure"
import { filterAndSortProducts, type ProductFormValues, toCreateProductDto } from "core/models/product"
import { PATHS } from "router/paths"
import { paginate } from "shared/utils/pagination"

import { CatalogContent } from "../sections/catalog/catalog-content"
import { CatalogPager } from "../sections/catalog/catalog-pager"
import { CatalogToolbar } from "../sections/catalog/catalog-toolbar"
import {
  catalogPageParser,
  catalogPageSizeParser,
  catalogQueryParser,
  catalogSortParser,
  catalogTypeParser,
  catalogViewParser,
  type PageSize,
} from "../sections/catalog/catalog-view"
import { CreateProductDialog } from "../sections/catalog/create-product-dialog"
import type { CreateProductResult } from "../sections/catalog/create-product-form"

export const handle = {
  title: "Catálogo",
  description: "Tus productos y servicios — de acá salen los pedidos",
}

export default function CatalogPage() {
  const navigate = useNavigate()
  const [view, setView] = useQueryState("view", catalogViewParser)
  const [query, setQuery] = useQueryState("q", catalogQueryParser)
  const [sort, setSort] = useQueryState("sort", catalogSortParser)
  const [type, setType] = useQueryState("type", catalogTypeParser)
  const [page, setPage] = useQueryState("page", catalogPageParser)
  const [pageSize, setPageSize] = useQueryState("pageSize", catalogPageSizeParser)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data: products, isPending, isError } = useProducts()
  const { mutateAsync: createProduct } = useCreateProduct()

  const pagination = useMemo(() => {
    if (!products) return undefined

    // El orden son las flechas de los encabezados de la tabla: en tarjetas no existen, así que no se aplica.
    const filtered = filterAndSortProducts(products, query, view === "list" ? sort : "default", type)

    return paginate(filtered, page, pageSize)
  }, [products, query, sort, type, view, page, pageSize])

  const hasFilters = query.trim() !== "" || type !== "all"

  // Cambiar lo que se filtra, el orden o el tamaño de página deja la página actual sin sentido: se vuelve a la primera.
  function onQueryChange(next: string) {
    void setQuery(next)
    void setPage(1)
  }

  function onTypeChange(next: typeof type) {
    void setType(next)
    void setPage(1)
  }

  function onSortChange(next: typeof sort) {
    void setSort(next)
    void setPage(1)
  }

  function onPageSizeChange(next: PageSize) {
    void setPageSize(next)
    void setPage(1)
  }

  async function handleCreate(values: ProductFormValues): Promise<CreateProductResult> {
    try {
      const created = await createProduct(toCreateProductDto(values))
      toast.success(`«${created.name}» creado`)

      return "created"
    } catch (error) {
      // Un SKU repetido lo corrige el usuario en el campo; cualquier otro fallo se avisa acá.
      if (isHttpFailure(error) && error.status === 409) return "sku-taken"

      toast.error(getHttpErrorMessage(error))

      return "failed"
    }
  }

  const pagerProps = pagination && {
    shown: pagination.items.length,
    total: pagination.total,
    hasFilters,
    page: pagination.page,
    pageCount: pagination.pageCount,
    pageSize,
    onPageChange: (next: number) => void setPage(next),
    onPageSizeChange,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <CatalogToolbar
          view={view}
          query={query}
          type={type}
          onViewChange={(next) => void setView(next)}
          onQueryChange={onQueryChange}
          onTypeChange={onTypeChange}
          onCreate={() => setIsCreateOpen(true)}
          onImport={() => void navigate(PATHS.CATALOG.IMPORT)}
        />
        {pagerProps && pagerProps.total > 0 && <CatalogPager position="superior" {...pagerProps} />}
      </div>

      <CatalogContent
        view={view}
        sort={sort}
        onSortChange={onSortChange}
        products={pagination?.items}
        hasFilters={hasFilters}
        isPending={isPending}
        isError={isError}
      />

      {pagerProps && pagerProps.total > 0 && <CatalogPager position="inferior" {...pagerProps} />}

      <CreateProductDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={handleCreate} />
    </div>
  )
}
