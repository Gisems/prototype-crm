export interface Paginated<T> {
  /** Los elementos de la página actual. */
  items: T[]
  /** La página efectiva, ya acotada a `1..pageCount`: una URL con `?page=99` no deja la lista vacía. */
  page: number
  pageCount: number
  /** Cuántos elementos hay en total, sumando todas las páginas. */
  total: number
}

export function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * pageSize

  return { items: items.slice(start, start + pageSize), page: current, pageCount, total }
}
