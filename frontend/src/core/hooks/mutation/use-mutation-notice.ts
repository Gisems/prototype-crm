import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { noticeService } from "core/services/notices/instance"

export function useMarkNoticeRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => noticeService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.NOTICES] }),
  })
}

export function useMarkAllNoticesRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => noticeService.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.NOTICES] }),
  })
}
