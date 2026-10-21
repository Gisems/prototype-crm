import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { ChangePasswordDto, SignInDto } from "core/models/auth"
import { authService } from "core/services/auth/instance"
import { sessionStore } from "core/store/auth-session"

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: SignInDto) => {
      const result = await authService.signIn(values)
      sessionStore.save(result.token, { persist: values.rememberMe })

      return result
    },
    onSuccess: ({ user }) => queryClient.setQueryData([QueryKeysEnum.SESSION], user),
  })
}

export function useChangePassword() {
  return useMutation({ mutationFn: (dto: ChangePasswordDto) => authService.changePassword(dto) })
}

/**
 * Vaciar la caché es parte de cerrar sesión: lo que ya se descargó sigue en memoria y el siguiente
 * usuario de esta máquina lo vería antes del primer refetch. La navegación la decide quien llama.
 */
export function useSignOut() {
  const queryClient = useQueryClient()

  return useCallback(async () => {
    await authService.signOut().catch(() => undefined)
    sessionStore.clear()
    queryClient.clear()
  }, [queryClient])
}
