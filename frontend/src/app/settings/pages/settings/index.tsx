import { Navigate } from "react-router"

import { PATHS } from "router/paths"

export default function SettingsIndex() {
  return <Navigate to={PATHS.SETTINGS.CHANNELS} replace />
}
