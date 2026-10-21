import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { CreateMemberDto } from "core/models/team"
import { memberService } from "core/services/team/instance"

// El equipo también lo lee Plan y facturación (puestos usados): una sola clave, así que todo se refresca junto.

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateMemberDto) => memberService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.TEAM_MEMBERS] }),
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CreateMemberDto }) => memberService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.TEAM_MEMBERS] }),
  })
}

export function useSetMemberActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => memberService.setActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.TEAM_MEMBERS] }),
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => memberService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.TEAM_MEMBERS] }),
  })
}
