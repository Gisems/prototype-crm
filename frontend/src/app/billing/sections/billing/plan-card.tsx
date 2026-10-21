import { Check } from "lucide-react"

import type { Plan } from "core/models/billing"
import { Button } from "shared/components/ui/button"
import { formatMoney } from "shared/utils/currency"
import { formatNumber } from "shared/utils/number"

interface PlanCardProps {
  plan: Plan
  isCurrent: boolean
  isSelected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, isCurrent, isSelected, onSelect }: Readonly<PlanCardProps>) {
  const highlights = [
    `${plan.seatsIncluded} miembros del equipo`,
    `${formatNumber(plan.messagesIncluded)} mensajes al mes`,
    ...plan.features,
  ]

  return (
    <article
      className={`relative flex flex-col gap-4 rounded-xl border bg-card p-5 ${
        plan.popular ? "border-accent shadow-md" : ""
      } ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold whitespace-nowrap text-accent-foreground">
          Más popular
        </span>
      )}

      <div>
        <h3 className="text-lg font-bold">{plan.name}</h3>
        <p className="mt-1">
          <span className="text-3xl font-bold text-primary">{formatMoney(plan.price, plan.currency)}</span>{" "}
          <span className="text-sm text-muted-foreground">/ mes</span>
        </p>
      </div>

      <ul className="flex flex-col gap-2 text-sm">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-success" /> {highlight}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={isSelected ? "default" : "outline"}
        disabled={isCurrent}
        aria-pressed={isSelected}
        className="mt-auto"
        onClick={onSelect}
      >
        {isCurrent ? "Tu plan actual" : isSelected ? "Seleccionado" : "Elegir plan"}
      </Button>
    </article>
  )
}
