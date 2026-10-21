import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { groupService } from "core/services/team/instance"

export function useGroups() {
  return useQuery({
    queryKey: [QueryKeysEnum.GROUPS],
    queryFn: () => groupService.list(),
  })
}
