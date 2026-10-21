import { ImageOff } from "lucide-react"

interface ProductImageProps {
  /** URL de la imagen; vacía si el producto aún no tiene. */
  image: string
  alt: string
  /** El tamaño lo da quien lo usa. */
  className: string
}

/** La imagen del producto, o un recuadro neutro si aún no tiene. */
export function ProductImage({ image, alt, className }: Readonly<ProductImageProps>) {
  if (!image) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}>
        <ImageOff className="size-6" aria-label="Sin imagen" />
      </div>
    )
  }

  return <img src={image} alt={alt} loading="lazy" className={`object-cover ${className}`} />
}
