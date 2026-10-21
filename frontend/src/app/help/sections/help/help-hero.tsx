import { PageBanner } from "shared/components/custom/page-banner"

export function HelpHero() {
  return (
    <PageBanner>
      <div>
        <h2 className="text-3xl leading-tight font-bold">¿En qué podemos ayudarte?</h2>
        <p className="text-sm text-white/80">
          Revisa las preguntas frecuentes o escríbenos: respondemos en menos de 24 hs.
        </p>
      </div>
    </PageBanner>
  )
}
