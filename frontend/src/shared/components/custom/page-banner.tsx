/**
 * La franja de color que abre una vista. Todas miden lo mismo (6,5 rem de alto mínimo) para que no cambie de
 * tamaño al pasar de una vista a otra: quien la usa solo pone su contenido, que debe caber en una fila.
 * En pantallas angostas el contenido se parte en más filas y la franja crece lo necesario.
 */
export function PageBanner({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="relative flex min-h-26 items-center overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] px-6 py-5 text-white shadow-sm">
      <div aria-hidden="true" className="absolute -top-16 -right-10 size-52 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -bottom-20 left-1/3 size-44 rounded-full bg-white/5" />

      <div className="relative flex w-full flex-wrap items-center gap-x-8 gap-y-3">{children}</div>
    </section>
  )
}
