import { TriangleAlert } from "lucide-react"
import { useState } from "react"

import { type CurrentUsage, overLimitWarnings, type Plan } from "core/models/billing"
import { Button } from "shared/components/ui/button"
import { formatMoney } from "shared/utils/currency"

import { PlanCard } from "./plan-card"

interface PlanPickerProps {
  plans: Plan[]
  currentPlan: Plan
  usage: CurrentUsage
  isChanging: boolean
  /** Resuelve `true` si el plan cambió; entonces se limpia la selección. */
  onConfirm: (planId: string) => Promise<boolean>
}

export function PlanPicker({ plans, currentPlan, usage, isChanging, onConfirm }: Readonly<PlanPickerProps>) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = plans.find((plan) => plan.id === selectedId && plan.id !== currentPlan.id)

  async function confirm(plan: Plan) {
    if (await onConfirm(plan.id)) setSelectedId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* El margen superior deja lugar a la etiqueta "Más popular", que sobresale de su tarjeta. */}
      <div className="grid gap-4 pt-3 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.id === currentPlan.id}
            isSelected={plan.id === selected?.id}
            onSelect={() => setSelectedId(plan.id)}
          />
        ))}
      </div>

      {selected && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-muted p-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              Cambiarás de {currentPlan.name} a {selected.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatMoney(currentPlan.price, currentPlan.currency)} → {formatMoney(selected.price, selected.currency)}{" "}
              / mes
            </p>
            {overLimitWarnings(selected, usage).map((warning) => (
              <p key={warning} className="mt-1 flex items-start gap-2 text-sm">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" /> {warning}
              </p>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="action"
              disabled={isChanging}
              onClick={() => setSelectedId(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isChanging}

              onClick={() => void confirm(selected)}
              variant="accent"
            >
              {isChanging ? "Cambiando…" : "Confirmar cambio"}
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
