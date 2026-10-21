import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import {
  invoiceService,
  paymentMethodService,
  planService,
  subscriptionService,
  usageService,
} from "core/services/billing/instance"

export function usePlans() {
  return useQuery({
    queryKey: [QueryKeysEnum.PLANS],
    queryFn: () => planService.list(),
  })
}

export function useSubscription() {
  return useQuery({
    queryKey: [QueryKeysEnum.SUBSCRIPTION],
    queryFn: () => subscriptionService.get(),
  })
}

export function useUsageHistory() {
  return useQuery({
    queryKey: [QueryKeysEnum.USAGE_HISTORY],
    queryFn: () => usageService.list(),
  })
}

export function usePaymentMethod() {
  return useQuery({
    queryKey: [QueryKeysEnum.PAYMENT_METHOD],
    queryFn: () => paymentMethodService.get(),
  })
}

export function useInvoices() {
  return useQuery({
    queryKey: [QueryKeysEnum.INVOICES],
    queryFn: () => invoiceService.list(),
  })
}
