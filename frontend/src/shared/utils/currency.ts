/** Sin decimales, como el prototipo; el símbolo y el separador de miles los pone Intl según la moneda. */
export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("es-UY", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)
}
