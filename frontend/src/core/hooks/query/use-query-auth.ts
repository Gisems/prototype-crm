import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { authService } from "core/services/auth/instance"
import { sessionStore } from "core/store/auth-session"

/**
 * El token dice que hay sesión; `authService.me()` dice de quién. Sin token no se pregunta, y un fallo
 * —token vencido o revocado— vale como sesión cerrada: no se reintenta para no dejar al usuario
 * mirando una pantalla en blanco mientras se agotan los reintentos.
 */
export function useSession() {
  const token = sessionStore.getAccessToken()

  const { data: user, isPending } = useQuery({
    queryKey: [QueryKeysEnum.SESSION],
    queryFn: () => authService.me(token ?? ""),
    enabled: !!token,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })

  return {
    user,
    isAuthenticated: !!user,
    isLoading: !!token && isPending,
  }
}
