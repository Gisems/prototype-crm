import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { SavePaymentMethodDto } from "core/models/billing"
import { paymentMethodService, subscriptionService } from "core/services/billing/instance"

export function useChangePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => subscriptionService.changePlan(planId),
    onSuccess: (subscription) => queryClient.setQueryData([QueryKeysEnum.SUBSCRIPTION], subscription),
  })
}

export function useSavePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SavePaymentMethodDto) => paymentMethodService.save(dto),
    onSuccess: (paymentMethod) => queryClient.setQueryData([QueryKeysEnum.PAYMENT_METHOD], paymentMethod),
  })
}
