import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { memberService } from "core/services/team/instance"

export function useTeamMembers() {
  return useQuery({
    queryKey: [QueryKeysEnum.TEAM_MEMBERS],
    queryFn: () => memberService.list(),
  })
}
