import { HttpFailure } from "core/lib/client/failure"
import {
  type ChangePasswordDto,
  type SignInDto,
  type SignInResponse,
  signInResponseSchema,
  type User,
  userSchema,
} from "core/models/auth"

/**
 * MOCK: el backend aún no tiene módulo de auth, así que estas credenciales son las del prototipo
 * (`docs/prototype`). Cuando exista, cada método pasa a `crmClient` con su `decode` y el resto de la
 * app no cambia: hooks y pantallas solo conocen esta interfaz.
 */
const DEMO_USER: User = { id: "demo", email: "info@g2i.com", name: "Equipo G2I" }
let demoPassword = "@Testcrm"
const DEMO_TOKEN = "demo-session-token"

/** Simula la latencia de red para que el estado "Ingresando…" sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createAuthService() {
  return {
    async signIn({ email, password }: SignInDto): Promise<SignInResponse> {
      await delay(500)

      if (email.toLowerCase() !== DEMO_USER.email || password !== demoPassword) {
        throw new HttpFailure("Invalid credentials", { kind: "http", status: 401 })
      }

      return signInResponseSchema.parse({ token: DEMO_TOKEN, user: DEMO_USER })
    },

    async me(token: string): Promise<User> {
      await delay(150)

      if (token !== DEMO_TOKEN) throw new HttpFailure("Invalid session", { kind: "http", status: 401 })

      return userSchema.parse(DEMO_USER)
    },

    /** 400 con mensaje si la actual no coincide (no 401: un 401 cierra la sesión entera, ver `query-client`). */
    async changePassword({ currentPassword, newPassword }: ChangePasswordDto): Promise<void> {
      await delay(500)

      if (currentPassword !== demoPassword) {
        throw new HttpFailure("Wrong current password", {
          kind: "http",
          status: 400,
          backendMessage: "La contraseña actual no es correcta.",
        })
      }

      demoPassword = newPassword
    },

    /** Sin backend no hay nada que revocar; queda el método para que el cierre de sesión ya pase por acá. */
    async signOut(): Promise<void> {},
  }
}

export type AuthService = ReturnType<typeof createAuthService>
