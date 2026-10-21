import { z } from "zod"

export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({
    data: z.array(item),
    meta: z.object({
      page: z.number().int(),
      pageSize: z.number().int(),
      totalItems: z.number().int(),
      totalPages: z.number().int(),
    }),
  })
}

export const requiredMessage = "Campo requerido"
export const invalidFormatMessage = "Formato inválido"
export const maxLengthMessage = (max: number) => `Máximo ${max} caracteres`

export function requiredString(max?: number) {
  const schema = z.string().trim().min(1, { error: requiredMessage })
  return max === undefined ? schema : schema.max(max, { error: maxLengthMessage(max) })
}

/** Un input vacío llega como `""`, nunca como `undefined`: se normaliza aquí para que el tipo de salida sea cierto. */
export function optionalString(max?: number) {
  const schema = z.string().trim()
  return (max === undefined ? schema : schema.max(max, { error: maxLengthMessage(max) })).transform(
    (val) => val || undefined,
  )
}

/**
 * Zod 4 salta un refinamiento del objeto si falló cualquier campo, así que un check cruzado no se
 * avisaba hasta llenar todo el formulario. Con `when` corre en cuanto sus propios campos son válidos.
 */
export const whenValid = (...fields: string[]) => ({
  when: ({ issues }: z.core.ParsePayload) => !issues.some((issue) => fields.includes(String(issue.path?.[0]))),
})
