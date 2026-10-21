import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { UpdateChannelDto } from "core/models/channel"
import { channelService } from "core/services/automation/instance"

export function useUpdateChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, change }: { id: string; change: UpdateChannelDto }) => channelService.update(id, change),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.CHANNELS] }),
  })
}
