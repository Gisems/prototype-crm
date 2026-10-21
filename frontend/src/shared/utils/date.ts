const dateFormatter = new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "2-digit", year: "numeric" })

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * `dd/MM/yyyy`. Una fecha sin hora (`2026-11-01`) se muestra tal cual: `new Date` la leería como medianoche
 * UTC y, al oeste de Greenwich, aparecería el día anterior. Un instante con hora se muestra en la zona del navegador.
 */
export function formatDate(value: string) {
  const dateOnly = DATE_ONLY.exec(value)

  return dateFormatter.format(
    dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value),
  )
}

const monthFormatter = new Intl.DateTimeFormat("es-UY", { month: "short" })

/** `2026-10` → `oct`. */
export function formatMonthShort(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number)

  return monthFormatter.format(new Date(year ?? 0, (month ?? 1) - 1, 1)).replace(".", "")
}
