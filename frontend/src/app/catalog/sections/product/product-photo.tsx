import type { Product } from "core/models/product"

import { itemDetail, itemStatus } from "../../components/item-labels"
import { ProductImagePicker } from "../../components/product-image-picker"

interface ProductPhotoProps {
  /** El ítem guardado: de él salen el SKU, el nombre y el stock (o el detalle del servicio) que se muestran bajo la foto. */
  product: Product
  /** La foto del formulario, que puede ser una elegida y aún sin guardar. */
  image: string
  onImageChange: (image: string) => void
}

export function ProductPhoto({ product, image, onImageChange }: Readonly<ProductPhotoProps>) {
  const status = itemStatus(product)

  return (
    <aside className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <ProductImagePicker image={image} alt={product.name} onImageChange={onImageChange}>
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{product.sku}</p>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className={`text-sm ${status.className}`}>
            {product.type === "service" ? `${status.label} · ${itemDetail(product)}` : status.label}
          </p>
        </div>
      </ProductImagePicker>
    </aside>
  )
}
