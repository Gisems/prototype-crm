interface SegmentedControlProps<T extends string> {
  /** Para el lector de pantalla: qué se está eligiendo. */
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** Una opción a la vez, en una píldora: para cambiar de vista o de período sin salir de la pantalla. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: Readonly<SegmentedControlProps<T>>) {
  return (
    <fieldset className="flex w-fit gap-1 rounded-full border bg-card p-1">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
            option.value === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
