import { type Customer, type CustomerFormValues, toCustomerFormInput } from "core/models/customer"
import type { TeamMember } from "core/models/team"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { CustomerForm } from "./customer-form"

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** El cliente que se edita; `null` para agregar uno nuevo. */
  customer: Customer | null
  members: TeamMember[]
  onSubmit: (values: CustomerFormValues) => Promise<boolean>
}

export function CustomerDialog({ open, onOpenChange, customer, members, onSubmit }: Readonly<CustomerDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{customer ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          <DialogDescription>
            {customer ? "Cambia los datos de este cliente." : "Suma un cliente a tu base de contactos."}
          </DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura parte de cero. */}
        <CustomerForm
          initial={customer ? toCustomerFormInput(customer) : undefined}
          members={members}
          submitLabel={customer ? "Guardar" : "Agregar"}
          submittingLabel={customer ? "Guardando…" : "Agregando…"}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
