import { Navigate } from "react-router"

import { PATHS } from "router/paths"

export default function ContactsIndex() {
  return <Navigate to={PATHS.CONTACTS.CUSTOMERS} replace />
}
