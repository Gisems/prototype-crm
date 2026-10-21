import { Mail, MessageCircle, Phone } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ContactCardProps {
  icon: LucideIcon
  title: string
  detail: string
  /** Con `href` la tarjeta es un enlace (`mailto:`, `tel:`). */
  href?: string
  /** El chip de color del ícono; por defecto el de marca. */
  iconClassName?: string
  /** Lo que va al pie de la tarjeta: un estado, o la acción. */
  footer?: React.ReactNode
}

function ContactCard({
  icon: Icon,
  title,
  detail,
  href,
  iconClassName = "bg-primary/10 text-primary",
  footer,
}: Readonly<ContactCardProps>) {
  const content = (
    <>
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon className="size-6" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-bold">{title}</span>
        <span className="text-sm text-muted-foreground">{detail}</span>
        {footer && <span className="mt-2 text-sm font-medium">{footer}</span>}
      </span>
    </>
  )
  const className = "flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm"

  return href ? (
    <a href={href} className={`${className} transition-all hover:-translate-y-0.5 hover:shadow-md`}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

function Availability({ isOpen }: Readonly<{ isOpen: boolean }>) {
  return (
    <span className={`flex items-center gap-1.5 ${isOpen ? "text-success" : "text-muted-foreground"}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${isOpen ? "bg-success" : "bg-muted-foreground/50"}`} />
      {isOpen ? "Disponible ahora" : "Fuera de horario"}
    </span>
  )
}

export function ContactMethods({ isChatOpen }: Readonly<{ isChatOpen: boolean }>) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <ContactCard
        icon={MessageCircle}
        title="Chat en vivo"
        detail="Lun a vie, 9 a 18 hs"
        iconClassName={isChatOpen ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}
        footer={<Availability isOpen={isChatOpen} />}
      />
      <ContactCard
        icon={Mail}
        title="soporte@chatg2i.uy"
        detail="Respuesta en menos de 24 hs"
        href="mailto:soporte@chatg2i.uy"
        footer={<span className="text-primary">Enviar un email →</span>}
      />
      <ContactCard
        icon={Phone}
        title="+598 2900 0000"
        detail="Solo planes Profesional y superiores"
        href="tel:+59829000000"
        footer={<span className="text-primary">Llamar →</span>}
      />
    </div>
  )
}
