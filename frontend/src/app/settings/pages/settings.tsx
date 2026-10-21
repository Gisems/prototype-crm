import { Outlet } from "react-router"

import { SettingsTabs } from "../sections/settings/settings-tabs"

export const handle = {
  title: "Configuración",
  description: "Vincula canales, activa bots y gestiona tu equipo",
}

// Vista de administrador, como Plan y facturación: cuando exista el manejo de roles, esta ruta y su ítem del menú
// (`router/menu.ts`) se ocultan a quienes no son admin. Cada pestaña es una ruta hija que carga sus propios datos.
export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsTabs />
      <Outlet />
    </div>
  )
}
