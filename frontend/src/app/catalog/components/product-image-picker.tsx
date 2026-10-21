import { ImagePlus, Trash2 } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

import { Button } from "shared/components/ui/button"
import { readFileAsDataUrl } from "shared/utils/file"

import { ProductImage } from "./product-image"

const MAX_IMAGE_MB = 5

interface ProductImagePickerProps {
  /** La imagen del formulario, que puede ser una elegida y aún sin guardar. */
  image: string
  alt: string
  onImageChange: (image: string) => void
  /** Va entre la imagen y los botones: en el perfil, los datos del producto. */
  children?: React.ReactNode
}

/** Vista previa de la foto del producto con los botones para subirla, cambiarla o quitarla. */
export function ProductImagePicker({ image, alt, onImageChange, children }: Readonly<ProductImagePickerProps>) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function onFileChosen(file: File | undefined) {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`La imagen no puede pesar más de ${MAX_IMAGE_MB} MB`)
      return
    }

    onImageChange(await readFileAsDataUrl(file))
  }

  return (
    <div className="flex flex-col">
      <ProductImage image={image} alt={alt} className="aspect-square w-full" />
      <div className="flex flex-col gap-3 px-4 py-3">
        {children}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Elegir foto del producto"
          onChange={(event) => {
            void onFileChosen(event.target.files?.[0])
            // Sin esto, elegir de nuevo el mismo archivo no dispara `change`.
            event.target.value = ""
          }}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => inputRef.current?.click()}>
            <ImagePlus /> {image ? "Cambiar foto" : "Subir foto"}
          </Button>
          {image && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Quitar foto"
              onClick={() => onImageChange("")}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
