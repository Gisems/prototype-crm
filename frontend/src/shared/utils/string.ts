/** Sin tildes ni mayúsculas, para comparar texto escrito a mano: "campera" encuentra "Campéra". */
export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

/** Las iniciales de las dos primeras palabras: `Julia Méndez` → `JM`. */
export function initials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}
