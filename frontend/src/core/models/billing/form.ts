import { z } from "zod"

import { requiredString } from "shared/utils/schema"

import { isNotExpired, isValidCardNumber } from "./card"

export const cardFormSchema = z.object({
  number: requiredString()
    .transform((number) => number.replaceAll(/\s/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{12,19}$/, "Ingresa un número de tarjeta válido")
        .refine(isValidCardNumber, "El número de tarjeta no es válido"),
    ),
  expiry: requiredString().pipe(
    z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Usa el formato MM/AA")
      .refine((expiry) => isNotExpired(expiry), "La tarjeta está vencida"),
  ),
  cvv: requiredString().pipe(z.string().regex(/^\d{3,4}$/, "Ingresa 3 o 4 dígitos")),
})

export type CardFormInput = z.input<typeof cardFormSchema>
export type CardFormValues = z.output<typeof cardFormSchema>

export const emptyCardFormInput: CardFormInput = { number: "", expiry: "", cvv: "" }
