import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { SaveGroupDto } from "core/models/group"
import { groupService } from "core/services/team/instance"

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SaveGroupDto) => groupService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.GROUPS] }),
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SaveGroupDto }) => groupService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.GROUPS] }),
  })
}

export function useRemoveGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => groupService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.GROUPS] }),
  })
}
