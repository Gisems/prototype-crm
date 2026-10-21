import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { noticeService } from "core/services/notices/instance"

/** Cada cuánto se pregunta si hay avisos nuevos: un mantenimiento anunciado mientras alguien trabaja debe llegarle. */
const REFRESH_MS = 60_000

export function useNotices() {
  return useQuery({
    queryKey: [QueryKeysEnum.NOTICES],
    queryFn: () => noticeService.list(),
    refetchInterval: REFRESH_MS,
  })
}
