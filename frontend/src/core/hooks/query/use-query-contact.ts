import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { customerService, supplierService } from "core/services/contacts/instance"

export function useCustomers() {
  return useQuery({
    queryKey: [QueryKeysEnum.CUSTOMERS],
    queryFn: () => customerService.list(),
  })
}

export function useSuppliers() {
  return useQuery({
    queryKey: [QueryKeysEnum.SUPPLIERS],
    queryFn: () => supplierService.list(),
  })
}
