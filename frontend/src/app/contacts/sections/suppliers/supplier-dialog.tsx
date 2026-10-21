import { type Supplier, type SupplierFormValues, toSupplierFormInput } from "core/models/supplier"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { SupplierForm } from "./supplier-form"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** El proveedor que se edita; `null` para agregar uno nuevo. */
  supplier: Supplier | null
  onSubmit: (values: SupplierFormValues) => Promise<boolean>
}

export function SupplierDialog({ open, onOpenChange, supplier, onSubmit }: Readonly<SupplierDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle>
          <DialogDescription>
            {supplier ? "Cambia los datos de este proveedor." : "Suma un proveedor a tu agenda."}
          </DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura parte de cero. */}
        <SupplierForm
          initial={supplier ? toSupplierFormInput(supplier) : undefined}
          submitLabel={supplier ? "Guardar" : "Agregar"}
          submittingLabel={supplier ? "Guardando…" : "Agregando…"}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
