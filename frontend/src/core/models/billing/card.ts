import type { CardBrand } from "./response"

/** Solo se reconocen las marcas más comunes; el resto queda como "Otra" y se muestra sin logo. */
export function detectCardBrand(number: string): CardBrand {
  if (number.startsWith("4")) return "Visa"
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(number)) return "Mastercard"
  if (/^3[47]/.test(number)) return "Amex"

  return "Otra"
}

/** Algoritmo de Luhn: detecta un número mal tipeado antes de enviarlo al procesador de pagos. */
export function isValidCardNumber(number: string) {
  let sum = 0

  for (let index = 0; index < number.length; index++) {
    let digit = Number(number.charAt(number.length - 1 - index))

    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
  }

  return number.length > 0 && sum % 10 === 0
}

/** Una tarjeta vale hasta el último día del mes de su vencimiento (`MM/AA`). */
export function isNotExpired(expiry: string, now = new Date()) {
  const [month, year] = expiry.split("/").map(Number)

  if (!month || year === undefined) return false

  return new Date(2000 + year, month, 1) > now
}

/** Agrupa de a cuatro dígitos mientras se escribe: `4242424242424242` → `4242 4242 4242 4242`. */
export function formatCardNumber(raw: string) {
  return (
    raw
      .replaceAll(/\D/g, "")
      .slice(0, 19)
      .match(/.{1,4}/g)
      ?.join(" ") ?? ""
  )
}

/** Inserta la barra mientras se escribe: `0828` → `08/28`. */
export function formatExpiry(raw: string) {
  const digits = raw.replaceAll(/\D/g, "").slice(0, 4)

  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}
