import { Plus } from "lucide-react"
import { Link } from "react-router"

import type { Plan } from "core/models/billing"
import { PATHS } from "router/paths"
import { Button } from "shared/components/ui/button"

interface TeamHeaderProps {
  /** `undefined` mientras carga. */
  seatsUsed: number | undefined
  plan: Plan | undefined
  onAdd: () => void
}

export function TeamHeader({ seatsUsed, plan, onAdd }: Readonly<TeamHeaderProps>) {
  const isFull = seatsUsed !== undefined && plan !== undefined && seatsUsed >= plan.seatsIncluded

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Cuentas del personal</h2>
          {seatsUsed !== undefined && plan && (
            <p className="text-sm text-muted-foreground">
              {seatsUsed} de {plan.seatsIncluded} puestos de tu plan {plan.name}
            </p>
          )}
        </div>

        <Button
          type="button"

          onClick={onAdd}
          variant="accent"
        >
          <Plus /> Agregar miembro
        </Button>
      </div>

      {isFull && (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm">
          Ya usas todos los puestos incluidos en tu plan.{" "}
          <Link to={PATHS.BILLING} className="font-medium text-primary hover:underline">
            Ver plan y facturación
          </Link>
        </p>
      )}
    </div>
  )
}
