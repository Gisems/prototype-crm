import { ArrowLeft } from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

import { getHttpErrorMessage } from "core/hooks/error-message"
import { useImportProducts } from "core/hooks/mutation/use-mutation-product"
import { useProducts } from "core/hooks/query/use-query-product"
import {
  buildImportRows,
  type ImportField,
  type ImportMapping,
  type ImportRow,
  type ImportTable,
  parseImportTable,
  suggestMapping,
} from "core/models/product"
import { PATHS } from "router/paths"
import { Skeleton } from "shared/components/ui/skeleton"
import { downloadTextFile } from "shared/utils/file"

import { ImportMappingStep } from "../sections/import/import-mapping-step"
import { ImportPreviewStep } from "../sections/import/import-preview-step"
import { ImportStepper, type ImportStep } from "../sections/import/import-stepper"
import { ImportUploadStep } from "../sections/import/import-upload-step"

export const handle = {
  title: "Importar catálogo",
  description: "Sube un archivo y acomoda sus columnas a los campos del catálogo",
}

const MAX_FILE_MB = 2

const TEMPLATE = [
  "sku,nombre,tipo,descripcion,precio,moneda,color,talle,stock,duracion,modalidad,unidad,imagen",
  "VES-FLO-M,Vestido floreado,producto,Vestido midi de tela liviana,1150,UYU,Floreado,M,12,,,,",
  "SRV-ASE-60,Asesoría de imagen,servicio,Sesión personalizada,1800,UYU,,,,60,presencial,sesión,",
].join("\n")

interface UploadedFile {
  table: ImportTable
  mapping: ImportMapping
}

export default function ImportPage() {
  const navigate = useNavigate()
  const { data: products } = useProducts()
  const { mutateAsync: importProducts, isPending: isImporting } = useImportProducts()
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

  const step: ImportStep = !uploaded ? 0 : isReviewing ? 2 : 1

  // Los SKU del catálogo deciden si una fila crea o actualiza, así que la revisión espera a tenerlos.
  const rows = useMemo(
    () =>
      isReviewing && uploaded && products
        ? buildImportRows(
            uploaded.table,
            uploaded.mapping,
            new Map(products.map((product) => [product.sku, product.type])),
          )
        : [],
    [isReviewing, uploaded, products],
  )

  async function onFileChosen(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("El archivo debe ser un CSV")
      return
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`El archivo no puede pesar más de ${MAX_FILE_MB} MB`)
      return
    }

    const table = parseImportTable(await file.text())

    if (!table) toast.error("El archivo está vacío")
    else if (table.rows.length === 0) toast.error("No encontramos filas para importar")
    else setUploaded({ table, mapping: suggestMapping(table.headers) })
  }

  function onMappingChange(field: ImportField, column: number | null) {
    setUploaded((current) => current && { ...current, mapping: { ...current.mapping, [field]: column } })
  }

  async function onConfirm(importRows: ImportRow[]) {
    // Las filas con error ya se mostraron en la revisión y se omiten: solo viajan las válidas.
    const dtos = importRows.flatMap((row) => (row.dto ? [row.dto] : []))

    try {
      const { created, updated } = await importProducts(dtos)
      toast.success(`Importación lista: ${created} creados, ${updated} actualizados`)
      void navigate(PATHS.CATALOG.INDEX)
    } catch (error) {
      toast.error(getHttpErrorMessage(error))
    }
  }

  return (
    <div className="flex max-w-4xl flex-col gap-5">
      <Link to={PATHS.CATALOG.INDEX} className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      <ImportStepper current={step} />

      {step === 0 && (
        <ImportUploadStep
          onFileChosen={(file) => void onFileChosen(file)}
          onDownloadTemplate={() => downloadTextFile("plantilla-catalogo.csv", TEMPLATE)}
        />
      )}

      {step === 1 && uploaded && (
        <ImportMappingStep
          table={uploaded.table}
          mapping={uploaded.mapping}
          onMappingChange={onMappingChange}
          onBack={() => setUploaded(null)}
          onContinue={() => setIsReviewing(true)}
        />
      )}

      {step === 2 &&
        (products ? (
          <ImportPreviewStep
            rows={rows}
            isImporting={isImporting}
            onBack={() => setIsReviewing(false)}
            onConfirm={() => void onConfirm(rows)}
          />
        ) : (
          <Skeleton className="h-72 rounded-lg" />
        ))}
    </div>
  )
}
