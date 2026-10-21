import { Download, FileSpreadsheet } from "lucide-react"
import { useState } from "react"

import { Button } from "shared/components/ui/button"

interface ImportUploadStepProps {
  onFileChosen: (file: File) => void
  onDownloadTemplate: () => void
}

export function ImportUploadStep({ onFileChosen, onDownloadTemplate }: Readonly<ImportUploadStepProps>) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div
        role="presentation"
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)

          const file = event.dataTransfer.files[0]
          if (file) onFileChosen(file)
        }}
        className={`rounded-lg border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-muted" : "border-input hover:bg-muted/50"
        }`}
      >
        <label className="flex cursor-pointer flex-col items-center gap-2 px-6 py-10 text-center">
          <FileSpreadsheet className="size-10 text-primary" />
          <span className="font-semibold">Arrastra tu archivo CSV acá o haz click para elegirlo</span>
          <span className="text-xs text-muted-foreground">
            Hasta 2 MB. Se puede exportar desde Excel o Google Sheets.
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            aria-label="Elegir archivo CSV del catálogo"
            onChange={(event) => {
              const file = event.target.files?.[0]
              // Sin esto, elegir de nuevo el mismo archivo no dispara `change`.
              event.target.value = ""
              if (file) onFileChosen(file)
            }}
          />
        </label>
      </div>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-semibold">¿Cómo debe ser el archivo?</p>
        <p className="mt-1 text-muted-foreground">
          Un CSV con una fila de encabezados y un ítem (producto o servicio) por fila. En el siguiente paso eliges qué
          columna va a cada campo, así que no hace falta que se llamen igual. Para crear o actualizar necesitamos al
          menos SKU, nombre y precio: si el SKU ya existe, el ítem se actualiza; si no, se crea. La columna tipo es
          opcional: sin ella, todo se toma como producto.
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onDownloadTemplate}>
          <Download /> Descargar plantilla
        </Button>
      </div>
    </div>
  )
}
