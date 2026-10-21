import { useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateCustomer, useRemoveCustomer, useUpdateCustomer } from "core/hooks/mutation/use-mutation-contact"
import { useCustomers } from "core/hooks/query/use-query-contact"
import { useTeamMembers } from "core/hooks/query/use-query-team"
import {
  allTags,
  type Customer,
  type CustomerFormValues,
  filterCustomers,
  toSaveCustomerDto,
} from "core/models/customer"
import { ConfirmDialog } from "shared/components/custom/confirm-dialog"
import { PageNav } from "shared/components/custom/page-nav"
import { paginate } from "shared/utils/pagination"

import { CustomerDialog } from "../../sections/customers/customer-dialog"
import { CustomerTable } from "../../sections/customers/customer-table"
import { CustomerToolbar } from "../../sections/customers/customer-toolbar"
import {
  CUSTOMERS_PER_PAGE,
  customersChannelParser,
  customersPageParser,
  customersQueryParser,
  customersStageParser,
  customersTagParser,
} from "../../sections/customers/customers-view"

export default function CustomersTab() {
  const [query, setQuery] = useQueryState("q", customersQueryParser)
  const [stage, setStage] = useQueryState("stage", customersStageParser)
  const [channel, setChannel] = useQueryState("channel", customersChannelParser)
  const [tag, setTag] = useQueryState("tag", customersTagParser)
  const [page, setPage] = useQueryState("page", customersPageParser)
  // El mismo diálogo agrega y edita: `editingCustomer` es a quién se edita, o `null` para agregar.
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const { data: customers, isPending, isError } = useCustomers()
  const { data: members } = useTeamMembers()
  const { mutateAsync: createCustomer } = useCreateCustomer()
  const { mutateAsync: updateCustomer } = useUpdateCustomer()
  const { mutateAsync: removeCustomer, isPending: isRemoving } = useRemoveCustomer()

  const hasFilters = query.trim() !== "" || stage !== "all" || channel !== "all" || tag !== ""

  const filtered = useMemo(
    () => customers && filterCustomers(customers, { query, stage, channel, tag }),
    [customers, query, stage, channel, tag],
  )
  const pagination = filtered && paginate(filtered, page, CUSTOMERS_PER_PAGE)

  // Cambiar lo que se filtra deja la página actual sin sentido: se vuelve a la primera.
  function changeFilter(update: () => unknown) {
    void update()
    void setPage(1)
  }

  function openDialog(customer: Customer | null) {
    setEditingCustomer(customer)
    setIsDialogOpen(true)
  }

  async function handleSubmit(values: CustomerFormValues) {
    try {
      if (editingCustomer) {
        await updateCustomer({ id: editingCustomer.id, dto: toSaveCustomerDto(values) })
        toast.success(`Datos de ${values.name} actualizados`)
      } else {
        await createCustomer(toSaveCustomerDto(values))
        toast.success(`${values.name} se sumó a tus clientes`)
      }

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleDelete() {
    if (!customerToDelete) return

    try {
      await removeCustomer(customerToDelete.id)
      toast.success("Cliente eliminado")
      setCustomerToDelete(null)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <CustomerToolbar
        query={query}
        stage={stage}
        channel={channel}
        tag={tag}
        tags={customers ? allTags(customers) : []}
        onQueryChange={(next) => changeFilter(() => setQuery(next))}
        onStageChange={(next) => changeFilter(() => setStage(next))}
        onChannelChange={(next) => changeFilter(() => setChannel(next))}
        onTagChange={(next) => changeFilter(() => setTag(next))}
        onCreate={() => openDialog(null)}
      />

      {customers && filtered && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} de {customers.length} clientes{hasFilters && " (filtrados)"}
        </p>
      )}

      <CustomerTable
        customers={pagination?.items}
        members={members}
        isPending={isPending}
        isError={isError}
        hasFilters={hasFilters}
        onEdit={openDialog}
        onDelete={setCustomerToDelete}
      />

      {pagination && pagination.pageCount > 1 && (
        <nav aria-label="Paginación de clientes" className="flex justify-center">
          <PageNav
            page={pagination.page}
            pageCount={pagination.pageCount}
            onPageChange={(next) => void setPage(next)}
          />
        </nav>
      )}

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={editingCustomer}
        members={members ?? []}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={customerToDelete !== null}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
        title="Eliminar cliente"
        description={`¿Eliminar a ${customerToDelete?.name ?? ""} de tus clientes? No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        isPending={isRemoving}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
