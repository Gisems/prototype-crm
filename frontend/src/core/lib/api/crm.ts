import config from "config"
import { sessionStore } from "core/store/auth-session"

import { createClient } from "../client/create-client"

/** El backend del CRM responde el JSON tal cual, sin envelope: cuando lo tenga, se desenvuelve acá. */
export const crmClient = createClient({
  baseURL: config.VITE_API_URL,
  getToken: () => sessionStore.getAccessToken(),
  unwrap: (body) => body,
})
