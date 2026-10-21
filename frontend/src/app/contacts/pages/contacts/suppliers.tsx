import { useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateSupplier, useRemoveSupplier, useUpdateSupplier } from "core/hooks/mutation/use-mutation-contact"
import { useSuppliers } from "core/hooks/query/use-query-contact"
import { filterSuppliers, type Supplier, type SupplierFormValues, toSaveSupplierDto } from "core/models/supplier"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"
import { PageNav } from "shared/components/custom/page-nav"
import { paginate } from "shared/utils/pagination"

import { SupplierDialog } from "../../sections/suppliers/supplier-dialog"
import { SupplierTable } from "../../sections/suppliers/supplier-table"
import { SupplierToolbar } from "../../sections/suppliers/supplier-toolbar"
import { SUPPLIERS_PER_PAGE, suppliersPageParser, suppliersQueryParser } from "../../sections/suppliers/suppliers-view"

export default function SuppliersTab() {
  const [query, setQuery] = useQueryState("q", suppliersQueryParser)
  const [page, setPage] = useQueryState("page", suppliersPageParser)
  // El mismo diálogo agrega y edita: `editingSupplier` es a quién se edita, o `null` para agregar.
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const { data: suppliers, isPending, isError } = useSuppliers()
  const { mutateAsync: createSupplier } = useCreateSupplier()
  const { mutateAsync: updateSupplier } = useUpdateSupplier()
  const { mutateAsync: removeSupplier, isPending: isRemoving } = useRemoveSupplier()

  const hasFilters = query.trim() !== ""

  const filtered = useMemo(() => suppliers && filterSuppliers(suppliers, query), [suppliers, query])
  const pagination = filtered && paginate(filtered, page, SUPPLIERS_PER_PAGE)

  function openDialog(supplier: Supplier | null) {
    setEditingSupplier(supplier)
    setIsDialogOpen(true)
  }

  async function handleSubmit(values: SupplierFormValues) {
    try {
      if (editingSupplier) {
        await updateSupplier({ id: editingSupplier.id, dto: toSaveSupplierDto(values) })
        toast.success(`Datos de ${values.name} actualizados`)
      } else {
        await createSupplier(toSaveSupplierDto(values))
        toast.success(`${values.name} se sumó a tus proveedores`)
      }

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleDelete() {
    if (!supplierToDelete) return

    try {
      await removeSupplier(supplierToDelete.id)
      toast.success("Proveedor eliminado")
      setSupplierToDelete(null)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <SupplierToolbar
        query={query}
        // Buscar deja la página actual sin sentido: se vuelve a la primera.
        onQueryChange={(next) => {
          void setQuery(next)
          void setPage(1)
        }}
        onCreate={() => openDialog(null)}
      />

      {suppliers && filtered && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} de {suppliers.length} proveedores{hasFilters && " (filtrados)"}
        </p>
      )}

      <SupplierTable
        suppliers={pagination?.items}
        isPending={isPending}
        isError={isError}
        hasFilters={hasFilters}
        onEdit={openDialog}
        onDelete={setSupplierToDelete}
      />

      {pagination && pagination.pageCount > 1 && (
        <nav aria-label="Paginación de proveedores" className="flex justify-center">
          <PageNav
            page={pagination.page}
            pageCount={pagination.pageCount}
            onPageChange={(next) => void setPage(next)}
          />
        </nav>
      )}

      <SupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={supplierToDelete !== null}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
        title="Eliminar proveedor"
        description={`¿Eliminar a ${supplierToDelete?.name ?? ""} de tus proveedores? No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        isPending={isRemoving}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
