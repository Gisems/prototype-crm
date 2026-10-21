/**
 * Parsea texto CSV a filas de celdas. Acepta `,` o `;` como separador (Excel en español exporta con `;`),
 * celdas entre comillas con comillas escapadas (`""`) y saltos de línea dentro de una celda.
 * El separador se deduce de la primera línea: el que más aparezca.
 */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, "").replaceAll("\r\n", "\n").replaceAll("\r", "\n")
  const firstLine = clean.split("\n", 1)[0] ?? ""
  const delimiter = firstLine.split(";").length > firstLine.split(",").length ? ";" : ","

  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  for (let index = 0; index < clean.length; index++) {
    const char = clean.charAt(index)

    if (inQuotes) {
      if (char !== '"') field += char
      else if (clean.charAt(index + 1) === '"') {
        field += '"'
        index++
      } else inQuotes = false
    } else if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      row.push(field)
      field = ""
    } else if (char === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) rows.push([...row, field])

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""))
}
