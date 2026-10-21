import { useEffect, useState } from "react"

/** La hora actual, que se renueva cada `intervalMs`: para lo que depende del reloj, como "en horario ahora". */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)

    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
