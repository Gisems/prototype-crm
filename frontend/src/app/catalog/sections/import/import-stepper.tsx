const STEPS = ["Archivo", "Campos", "Revisar"] as const

export type ImportStep = 0 | 1 | 2

export function ImportStepper({ current }: Readonly<{ current: ImportStep }>) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      {STEPS.map((label, index) => {
        const state = index === current ? "current" : index < current ? "done" : "todo"

        return (
          <li key={label} aria-current={state === "current" ? "step" : undefined} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                  state === "todo" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {index + 1}
              </span>
              <span className={state === "todo" ? "text-muted-foreground" : "font-semibold"}>{label}</span>
            </span>
            {index < STEPS.length - 1 && <span aria-hidden="true" className="h-px w-8 bg-border" />}
          </li>
        )
      })}
    </ol>
  )
}
