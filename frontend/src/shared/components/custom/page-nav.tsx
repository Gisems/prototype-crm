import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "shared/components/ui/button"

interface PageNavProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/** Primera, anterior, "Página X de Y", siguiente y última. Quien lo usa lo envuelve en su `nav` con su etiqueta. */
export function PageNav({ page, pageCount, onPageChange }: Readonly<PageNavProps>) {
  const isFirst = page <= 1
  const isLast = page >= pageCount

  return (
    <div className="flex items-center gap-1 text-sm">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Primera página"
        disabled={isFirst}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Página anterior"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <span className="px-2 whitespace-nowrap">
        Página {page} de {pageCount}
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Página siguiente"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Última página"
        disabled={isLast}
        onClick={() => onPageChange(pageCount)}
      >
        <ChevronsRight />
      </Button>
    </div>
  )
}
