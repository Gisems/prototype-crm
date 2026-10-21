import { Outlet } from "react-router"

import { ContactsTabs } from "../sections/contacts/contacts-tabs"

export const handle = {
  title: "Contactos",
  description: "Tus clientes y tus proveedores en un solo lugar",
}

// Cada pestaña es una ruta hija que carga sus propios datos.
export default function ContactsLayout() {
  return (
    <div className="flex flex-col gap-6">
      <ContactsTabs />
      <Outlet />
    </div>
  )
}
