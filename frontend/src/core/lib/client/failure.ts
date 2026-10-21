/**
 * Tipo de fallo que expone el cliente HTTP. La UI decide la copia en español a partir de esto;
 * el módulo no elige mensajes para el paciente.
 *
 * - `network`: la petición nunca llegó al backend.
 * - `http`: el backend respondió con un estado de error, o con un envelope que no es el suyo.
 * - `decode`: el backend respondió 200 con una forma que no podemos parsear.
 */
export type HttpFailureKind = "network" | "http" | "decode"

interface HttpFailureOptions {
  kind: HttpFailureKind
  status?: number
  backendMessage?: string
  opaqueMessage?: boolean
  cause?: unknown
}

export class HttpFailure extends Error {
  readonly kind: HttpFailureKind
  readonly status?: number
  readonly backendMessage?: string
  /**
   * Que `backendMessage` sea ilegible para el paciente: Cal.com responde en inglés y no se configura,
   * los backends propios en español. Viaja acá en vez de decidirse al atrapar el error porque un solo
   * `try` puede abarcar dos backends, como el de `bookAppointment`.
   */
  readonly opaqueMessage: boolean

  constructor(message: string, { kind, status, backendMessage, opaqueMessage = false, cause }: HttpFailureOptions) {
    super(message, { cause })
    this.name = "HttpFailure"
    this.kind = kind
    this.status = status
    this.backendMessage = backendMessage
    this.opaqueMessage = opaqueMessage
  }
}

export function isHttpFailure(error: unknown): error is HttpFailure {
  return error instanceof HttpFailure
}
