import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { CreateTicketDto } from "core/models/support"
import { ticketService } from "core/services/support/instance"

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateTicketDto) => ticketService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.TICKETS] }),
  })
}
