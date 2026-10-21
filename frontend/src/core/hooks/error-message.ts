import { isHttpFailure } from "core/lib/client/failure"

const defaultMessage = "Ups! Ocurrió un error inesperado"

export const getHttpErrorMessage = (error: unknown): string => {
  if (!isHttpFailure(error)) {
    return defaultMessage
  }

  if (error.kind === "network") {
    return "Error de conexión. Verifica tu conexión a internet."
  }

  if (error.opaqueMessage) {
    return defaultMessage
  }

  return error.backendMessage ?? defaultMessage
}
