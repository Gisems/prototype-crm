import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { channelService, flowService } from "core/services/automation/instance"

export function useChannels() {
  return useQuery({
    queryKey: [QueryKeysEnum.CHANNELS],
    queryFn: () => channelService.list(),
  })
}

export function useFlows() {
  return useQuery({
    queryKey: [QueryKeysEnum.FLOWS],
    queryFn: () => flowService.list(),
  })
}
