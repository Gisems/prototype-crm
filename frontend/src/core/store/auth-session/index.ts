const ACCESS_TOKEN_KEY = "token"

/**
 * En Safari con cookies bloqueadas `localStorage` existe pero lanza al tocarlo, así que un fallo
 * de almacenamiento degrada a "sin sesión" en vez de tumbar el árbol de React.
 */
function safely<T>(operation: () => T): T | null {
  try {
    return operation()
  } catch {
    return null
  }
}

function read(storage: () => Storage, key: string) {
  const value = safely(() => storage().getItem(key))

  return value && value.trim().length > 0 ? value : null
}

/**
 * Los `Storage` se inyectan para poder sustituirlos por dobles en los tests.
 *
 * "Mantener sesión" elige entre los dos: marcado sobrevive al cierre del navegador, sin marcar
 * muere con la pestaña. Se lee de ambos porque la elección es del login anterior, no de esta carga.
 */
export function createSessionStore(local: () => Storage, session: () => Storage) {
  return {
    /** Token de sesión del CRM; por ahora lo emite el servicio mock de core/services/auth. */
    getAccessToken(): string | null {
      return read(local, ACCESS_TOKEN_KEY) ?? read(session, ACCESS_TOKEN_KEY)
    },

    save(accessToken: string, { persist }: { persist: boolean }) {
      // Limpiar antes de escribir: sin esto, un login sin "mantener sesión" deja vivo el token que
      // dejó en `localStorage` un login anterior, y esa sesión sobrevive al cierre del navegador.
      this.clear()

      const storage = persist ? local : session

      safely(() => storage().setItem(ACCESS_TOKEN_KEY, accessToken))
    },

    clear() {
      for (const storage of [local, session]) {
        safely(() => storage().removeItem(ACCESS_TOKEN_KEY))
      }
    },
  }
}

export const sessionStore = createSessionStore(
  () => window.localStorage,
  () => window.sessionStorage,
)
