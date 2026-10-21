import { Navigate } from "react-router"

import { PATHS } from "router/paths"

// La raíz no tiene vista propia: se entra por el login, y el layout de auth reenvía al dashboard si ya hay sesión.
export default function HomePage() {
  return <Navigate to={PATHS.LOGIN} replace />
}
