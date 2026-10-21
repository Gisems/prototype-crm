/** Lee un archivo como `data:` URL, para mostrarlo y enviarlo sin un servidor de archivos. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener("load", () => {
      // `readAsDataURL` siempre deja un string; el chequeo es para el tipo (`string | ArrayBuffer | null`).
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("The file could not be read as a data URL"))
    })
    reader.addEventListener("error", () => reject(reader.error ?? new Error("The file could not be read")))
    reader.readAsDataURL(file)
  })
}

/** Descarga `content` como archivo. El BOM inicial hace que Excel abra el CSV en UTF-8 y no rompa las tildes. */
export function downloadTextFile(filename: string, content: string, mimeType = "text/csv") {
  const url = URL.createObjectURL(new Blob([`﻿${content}`], { type: `${mimeType};charset=utf-8` }))
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
