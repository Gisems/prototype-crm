import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import type { Faq } from "core/models/support"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "shared/components/ui/accordion"
import { Skeleton } from "shared/components/ui/skeleton"

import { FAQ_TOPICS } from "./faq-topics"

interface FaqSectionProps {
  faqs: Faq[] | undefined
  isPending: boolean
  isError: boolean
}

function FaqList({ faqs, isPending, isError }: Readonly<Pick<FaqSectionProps, "faqs" | "isPending" | "isError">>) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    )
  }

  if (isError) return <p className="text-sm text-destructive">No pudimos cargar las preguntas. Intenta de nuevo.</p>

  if (!faqs?.length) {
    return (
      <p className="rounded-xl bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
        Todavía no hay preguntas frecuentes. Escríbenos con el formulario y te ayudamos.
      </p>
    )
  }

  return (
    <Accordion>
      {faqs.map((faq) => {
        const { icon: Icon, link } = FAQ_TOPICS[faq.topic]

        return (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11">
                <p>{faq.answer}</p>
                {link && (
                  <Link
                    to={link.to}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {link.label} <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export function FaqSection({ faqs, isPending, isError }: Readonly<FaqSectionProps>) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Preguntas frecuentes</h2>

      <FaqList faqs={faqs} isPending={isPending} isError={isError} />
    </section>
  )
}
