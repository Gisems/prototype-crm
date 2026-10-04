import { index, layout, type RouteConfig, route } from "@react-router/dev/routes"

// Relativo a propósito: React Router carga este archivo con su propio config
// loader, fuera de la resolución de alias de la app, y "router/paths" no existe ahí.
import { PATHS } from "./router/paths"

export default [
  layout("./layouts/app-auth/app-auth.tsx", [index("./app/login/index.tsx")]),
  layout("./layouts/app-layout/app-layout.tsx", [route(PATHS.DASHBOARD, "./app/dashboard/index.tsx")]),
] satisfies RouteConfig
