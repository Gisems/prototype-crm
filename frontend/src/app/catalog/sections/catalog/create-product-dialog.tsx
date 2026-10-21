import type { ProductFormValues } from "core/models/product"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { CreateProductForm, type CreateProductResult } from "./create-product-form"

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: ProductFormValues) => Promise<CreateProductResult>
}

export function CreateProductDialog({ open, onOpenChange, onCreate }: Readonly<CreateProductDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear ítem</DialogTitle>
          <DialogDescription>
            Elige si es un producto o un servicio y completa sus datos para sumarlo al catálogo.
          </DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura empieza vacía. */}
        <CreateProductForm onCreate={onCreate} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
