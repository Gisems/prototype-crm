import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { faqService, ticketService } from "core/services/support/instance"

export function useFaqs() {
  return useQuery({
    queryKey: [QueryKeysEnum.FAQS],
    queryFn: () => faqService.list(),
  })
}

export function useTickets() {
  return useQuery({
    queryKey: [QueryKeysEnum.TICKETS],
    queryFn: () => ticketService.list(),
  })
}
