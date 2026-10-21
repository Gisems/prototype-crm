import type { CardFormValues } from "core/models/billing"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"

import { CardForm } from "./card-form"

interface CardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hasCard: boolean
  onSave: (values: CardFormValues) => Promise<boolean>
}

export function CardDialog({ open, onOpenChange, hasCard, onSave }: Readonly<CardDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{hasCard ? "Cambiar tarjeta" : "Agregar tarjeta"}</DialogTitle>
          <DialogDescription>La nueva tarjeta reemplaza a la actual para los próximos cobros.</DialogDescription>
        </DialogHeader>
        {/* El formulario vive dentro del contenido: al cerrar el modal se desmonta y cada apertura empieza vacía. */}
        <CardForm onSave={onSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
