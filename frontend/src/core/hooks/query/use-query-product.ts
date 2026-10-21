import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import { isHttpFailure } from "core/lib/client/failure"
import { productService } from "core/services/catalog/instance"

export function useProducts() {
  return useQuery({
    queryKey: [QueryKeysEnum.PRODUCTS],
    queryFn: () => productService.list(),
  })
}

export function useProduct(sku: string) {
  return useQuery({
    queryKey: [QueryKeysEnum.PRODUCTS, sku],
    queryFn: () => productService.getBySku(sku),
    // Un 404 es una respuesta definitiva: reintentar solo retrasa el "no existe".
    retry: (count, error) => !(isHttpFailure(error) && error.status === 404) && count < 3,
  })
}
