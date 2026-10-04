import { create } from "axios"

import config from "config"

export const api = create({ baseURL: config.VITE_API_URL })
