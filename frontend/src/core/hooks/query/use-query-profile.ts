import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { profileService } from "core/services/account/instance"
import { sessionStore } from "core/store/auth-session"

export function useProfile() {
  return useQuery({
    queryKey: [QueryKeysEnum.PROFILE],
    queryFn: () => profileService.get(),
    // Sin sesión no hay perfil que pedir: evita una consulta durante el cierre de sesión.
    enabled: !!sessionStore.getAccessToken(),
  })
}
