import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { SaveCustomerDto } from "core/models/customer"
import type { SaveSupplierDto } from "core/models/supplier"
import { customerService, supplierService } from "core/services/contacts/instance"

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SaveCustomerDto) => customerService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.CUSTOMERS] }),
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SaveCustomerDto }) => customerService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.CUSTOMERS] }),
  })
}

export function useRemoveCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => customerService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.CUSTOMERS] }),
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SaveSupplierDto) => supplierService.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.SUPPLIERS] }),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SaveSupplierDto }) => supplierService.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.SUPPLIERS] }),
  })
}

export function useRemoveSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => supplierService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.SUPPLIERS] }),
  })
}
