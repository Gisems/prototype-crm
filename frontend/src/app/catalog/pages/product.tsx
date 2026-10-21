import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useUpdateProduct } from "core/hooks/mutation/use-mutation-product"
import { useProduct } from "core/hooks/query/use-query-product"
import { isHttpFailure } from "core/lib/client/failure"
import { toUpdateProductDto } from "core/models/product"
import { PATHS } from "router/paths"
import { Skeleton } from "shared/components/ui/skeleton"

import { ProductForm } from "../sections/product/product-form"
import type { Route } from "./+types/product"

export const handle = {
  title: "Perfil del ítem",
  description: "Edita los datos del producto o servicio",
}

export default function ProductPage({ params }: Route.ComponentProps) {
  const { sku } = params
  const { data: product, isPending, error } = useProduct(sku)
  const { mutate, isPending: isSaving } = useUpdateProduct(sku)

  return (
    <div className="flex flex-col gap-5">
      <Link to={PATHS.CATALOG.INDEX} className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      {isPending && <Skeleton className="h-96 rounded-lg" />}

      {error &&
        (isHttpFailure(error) && error.status === 404 ? (
          <p className="text-sm text-muted-foreground">No encontramos ningún ítem con el SKU «{sku}».</p>
        ) : (
          <p className="text-sm text-destructive">{getHttpErrorMessage(error)}</p>
        ))}

      {product && (
        <ProductForm
          product={product}
          isSaving={isSaving}
          onSubmit={(values, onSaved) =>
            mutate(toUpdateProductDto(values), {
              onSuccess: (saved) => {
                toast.success("Ítem actualizado")
                onSaved(saved)
              },
              onError: (failure) => toast.error(getHttpErrorMessage(failure)),
            })
          }
        />
      )}
    </div>
  )
}
