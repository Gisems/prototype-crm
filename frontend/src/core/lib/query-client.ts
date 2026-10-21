import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"

import { sessionStore } from "core/store/auth-session"

import { isHttpFailure } from "./client/failure"

/**
 * Un 401 es la única respuesta que invalida la sesión entera, así que se atiende una vez acá y no
 * en cada hook: se borra el token y el guard del layout se encarga de sacar al usuario. No se
 * navega desde acá porque este módulo no conoce el router.
 */
function clearSessionOnUnauthorized(error: unknown) {
  if (isHttpFailure(error) && error.status === 401) sessionStore.clear()
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: clearSessionOnUnauthorized }),
    mutationCache: new MutationCache({ onError: clearSessionOnUnauthorized }),
    defaultOptions: {
      queries: {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  })
}
