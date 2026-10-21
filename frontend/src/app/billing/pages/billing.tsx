import { useState } from "react"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useChangePlan, useSavePaymentMethod } from "core/hooks/mutation/use-mutation-billing"
import {
  useInvoices,
  usePaymentMethod,
  usePlans,
  useSubscription,
  useUsageHistory,
} from "core/hooks/query/use-query-billing"
import { useTeamMembers } from "core/hooks/query/use-query-team"
import { type CardFormValues, toSavePaymentMethodDto } from "core/models/billing"
import { Skeleton } from "shared/components/ui/skeleton"

import { CardDialog } from "../sections/billing/card-dialog"
import { InvoiceHistory } from "../sections/billing/invoice-history"
import { MessagesUsage } from "../sections/billing/messages-usage"
import { PaymentSection } from "../sections/billing/payment-section"
import { PlanBanner } from "../sections/billing/plan-banner"
import { TeamUsage } from "../sections/billing/team-usage"

export const handle = {
  title: "Plan y facturación",
  description: "Tu suscripción, uso del mes y método de pago",
}

// Vista de administrador: hoy cualquiera que entra ve todo. Cuando exista el manejo de roles, esta ruta y su
// ítem del menú (`router/menu.ts`) se ocultan a quienes no son admin.
export default function BillingPage() {
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [invoicesPage, setInvoicesPage] = useState(1)
  const { data: plans, isError: isPlansError } = usePlans()
  const { data: subscription, isError: isSubscriptionError } = useSubscription()
  const { data: usageHistory, isPending: isUsagePending } = useUsageHistory()
  const { data: members, isPending: isMembersPending } = useTeamMembers()
  const { data: paymentMethod, isPending: isPaymentPending } = usePaymentMethod()
  const { data: invoices, isPending: isInvoicesPending } = useInvoices()
  const { mutateAsync: changePlan, isPending: isChanging } = useChangePlan()
  const { mutateAsync: savePaymentMethod } = useSavePaymentMethod()

  const currentPlan = plans?.find((plan) => plan.id === subscription?.planId)

  async function handleChangePlan(planId: string) {
    try {
      const updated = await changePlan(planId)
      const name = plans?.find((plan) => plan.id === updated.planId)?.name

      toast.success(name ? `Ahora estás en el plan ${name}` : "Plan actualizado")

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  async function handleSaveCard(values: CardFormValues) {
    try {
      await savePaymentMethod(toSavePaymentMethodDto(values))
      toast.success("Tarjeta actualizada")

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  if (isPlansError || isSubscriptionError) {
    return <p className="text-sm text-destructive">No pudimos cargar tu plan. Intenta de nuevo.</p>
  }

  return (
    // En pantallas grandes todo cabe en la vista: la altura es la de la ventana menos el encabezado y el margen
    // del layout, y lo que crece (facturas, equipo) se desplaza por dentro de su tarjeta.
    <div className="flex flex-col gap-5 lg:h-[calc(100svh-9rem)] lg:min-h-[34rem]">
      {currentPlan && subscription && plans && members ? (
        <PlanBanner
          plan={currentPlan}
          plans={plans}
          subscription={subscription}
          usage={{ messagesUsed: subscription.messagesUsed, seatsUsed: members.length }}
          isChanging={isChanging}
          onChangePlan={handleChangePlan}
        />
      ) : (
        <Skeleton className="h-24 rounded-xl" />
      )}

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <InvoiceHistory
          invoices={invoices}
          isPending={isInvoicesPending}
          page={invoicesPage}
          onPageChange={setInvoicesPage}
          nextCharge={
            currentPlan && subscription
              ? { date: subscription.renewalDate, amount: currentPlan.price, currency: currentPlan.currency }
              : undefined
          }
        />

        <div className="flex min-h-0 flex-col gap-5">
          <PaymentSection method={paymentMethod} isPending={isPaymentPending} onEdit={() => setIsCardOpen(true)} />
          <MessagesUsage
            used={subscription?.messagesUsed ?? 0}
            included={currentPlan?.messagesIncluded ?? 0}
            history={usageHistory}
            isPending={isUsagePending || !currentPlan}
          />
          <TeamUsage members={members} seatsIncluded={currentPlan?.seatsIncluded ?? 0} isPending={isMembersPending} />
        </div>
      </div>

      <CardDialog
        open={isCardOpen}
        onOpenChange={setIsCardOpen}
        hasCard={Boolean(paymentMethod)}
        onSave={handleSaveCard}
      />
    </div>
  )
}
