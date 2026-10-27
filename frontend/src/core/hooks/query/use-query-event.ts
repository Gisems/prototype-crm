import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { eventService } from "core/services/calendar/instance"

export function useEvents() {
  return useQuery({
    queryKey: [QueryKeysEnum.EVENTS],
    queryFn: () => eventService.list(),
  })
}
