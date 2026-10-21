import { PATHS } from "router/paths"
import { RouteTabs } from "shared/components/custom/route-tabs"

const TABS = [
  { label: "Clientes", to: PATHS.CONTACTS.CUSTOMERS },
  { label: "Proveedores", to: PATHS.CONTACTS.SUPPLIERS },
] as const

export function ContactsTabs() {
  return <RouteTabs label="Secciones de contactos" tabs={TABS} />
}
