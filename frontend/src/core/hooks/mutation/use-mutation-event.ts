import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { SaveEventDto } from "core/models/event"
import { eventService } from "core/services/calendar/instance"

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SaveEventDto) => eventService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.EVENTS] }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SaveEventDto }) => eventService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.EVENTS] }),
  })
}

export function useRemoveEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => eventService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.EVENTS] }),
  })
}
