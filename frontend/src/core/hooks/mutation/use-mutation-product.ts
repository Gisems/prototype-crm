import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { CreateProductDto, UpdateProductDto } from "core/models/product"
import { productService } from "core/services/catalog/instance"

export function useUpdateProduct(sku: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateProductDto) => productService.update(sku, dto),
    onSuccess: (product) => {
      queryClient.setQueryData([QueryKeysEnum.PRODUCTS, sku], product)

      // El listado también muestra estos datos: se refresca al volver en vez de parchearlo a mano.
      return queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.PRODUCTS], exact: true })
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productService.create(dto),
    onSuccess: (product) => {
      queryClient.setQueryData([QueryKeysEnum.PRODUCTS, product.sku], product)

      return queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.PRODUCTS], exact: true })
    },
  })
}

export function useImportProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dtos: CreateProductDto[]) => productService.importMany(dtos),
    // Sin `exact`: la importación también actualiza productos, así que los perfiles abiertos quedan viejos.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeysEnum.PRODUCTS] }),
  })
}
