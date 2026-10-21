import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useCreateTicket } from "core/hooks/mutation/use-mutation-support"
import { useFaqs, useTickets } from "core/hooks/query/use-query-support"
import { isChatOpen, type TicketFormValues, toCreateTicketDto } from "core/models/support"
import { useNow } from "shared/hooks/use-now"

import { ContactMethods } from "../sections/help/contact-methods"
import { FaqSection } from "../sections/help/faq-section"
import { HelpHero } from "../sections/help/help-hero"
import { TicketForm } from "../sections/help/ticket-form"
import { TicketList } from "../sections/help/ticket-list"

export const handle = {
  title: "Ayuda y soporte",
  description: "Preguntas frecuentes y contacto directo con nuestro equipo",
}

/** Cada cuánto se revisa si el chat en vivo entró o salió de su horario. */
const CLOCK_INTERVAL_MS = 60_000

export default function HelpPage() {
  const now = useNow(CLOCK_INTERVAL_MS)
  const { data: faqs, isPending: isFaqsPending, isError: isFaqsError } = useFaqs()
  const { data: tickets, isPending: isTicketsPending } = useTickets()
  const { mutateAsync: createTicket } = useCreateTicket()

  async function handleSubmit(values: TicketFormValues) {
    try {
      await createTicket(toCreateTicketDto(values))
      toast.success("Consulta enviada, te respondemos a la brevedad")

      return true
    } catch (error) {
      toast.error(getHttpErrorMessage(error))

      return false
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <HelpHero />

      <ContactMethods isChatOpen={isChatOpen(now)} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <FaqSection faqs={faqs} isPending={isFaqsPending} isError={isFaqsError} />

        <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold">Escríbenos directamente</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuéntanos qué necesitas y te respondemos por email en menos de 24 hs.
            </p>
          </div>
          <TicketForm onSubmit={handleSubmit} />
          <TicketList tickets={tickets} isPending={isTicketsPending} />
        </section>
      </div>
    </div>
  )
}
