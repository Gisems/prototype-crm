import { useState } from "react"

import type { CurrentUsage, Plan, Subscription } from "core/models/billing"
import { PageBanner } from "shared/components/custom/page-banner"
import { Button } from "shared/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "shared/components/ui/dialog"
import { formatMoney } from "shared/utils/currency"
import { formatDate } from "shared/utils/date"

import { PlanPicker } from "./plan-picker"

interface PlanBannerProps {
  plan: Plan
  plans: Plan[]
  subscription: Subscription
  usage: CurrentUsage
  isChanging: boolean
  /** Resuelve `true` si el plan cambió; entonces la ventana se cierra. */
  onChangePlan: (planId: string) => Promise<boolean>
}

/** El plan actual en una franja, y los planes en una ventana flotante en el centro de la pantalla. */
export function PlanBanner({ plan, plans, subscription, usage, isChanging, onChangePlan }: Readonly<PlanBannerProps>) {
  const [isOpen, setIsOpen] = useState(false)

  async function handleConfirm(planId: string) {
    const changed = await onChangePlan(planId)
    if (changed) setIsOpen(false)

    return changed
  }

  return (
    <PageBanner>
      <div>
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">Tu plan actual</p>
        <h2 className="text-3xl leading-tight font-bold">{plan.name}</h2>
      </div>

      <p>
        <span className="text-2xl font-bold">{formatMoney(plan.price, plan.currency)}</span>{" "}
        <span className="text-white/80">/ mes</span>
      </p>

      <p className="text-sm text-white/80">Se renueva el {formatDate(subscription.renewalDate)}</p>

      <ul className="hidden flex-wrap gap-1.5 xl:flex">
        {plan.features.map((feature) => (
          <li key={feature} className="rounded-full bg-white/15 px-3 py-1 text-xs">
            {feature}
          </li>
        ))}
      </ul>

      <Button type="button" className="ml-auto" onClick={() => setIsOpen(true)} variant="accent">
        Cambiar de plan
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cambiar de plan</DialogTitle>
            <DialogDescription>Elige el plan que mejor se ajusta a tu negocio.</DialogDescription>
          </DialogHeader>
          <PlanPicker
            plans={plans}
            currentPlan={plan}
            usage={usage}
            isChanging={isChanging}
            onConfirm={handleConfirm}
          />
        </DialogContent>
      </Dialog>
    </PageBanner>
  )
}
