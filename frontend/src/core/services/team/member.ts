import { HttpFailure } from "core/lib/client/failure"
import {
  ADMIN_ROLE,
  type CreateMemberDto,
  isLastActiveAdmin,
  type TeamMember,
  teamMemberSchema,
} from "core/models/team"

/**
 * MOCK: el equipo del prototipo (`docs/prototype`), en memoria: los cambios se pierden al recargar. Cuando
 * exista el backend, cada método pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
let mockMembers: TeamMember[] = [
  { id: 1, name: "Julia Méndez", email: "julia@chatg2i.uy", role: "Administrador", active: true },
  { id: 2, name: "Bruno Acosta", email: "bruno@chatg2i.uy", role: "Agente de ventas", active: true },
  { id: 3, name: "Sofía Ramos", email: "sofia@chatg2i.uy", role: "Soporte", active: false },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function findMember(id: number) {
  const member = mockMembers.find((item) => item.id === id)

  if (!member) throw new HttpFailure("Member not found", { kind: "http", status: 404 })

  return member
}

/** El backend también lo valida: la pantalla solo deshabilita el botón, no es la barrera. */
function assertNotLastAdmin(member: TeamMember) {
  if (isLastActiveAdmin(mockMembers, member)) {
    throw new HttpFailure("The last active admin cannot be removed or deactivated", {
      kind: "http",
      status: 409,
      backendMessage: "Debe quedar al menos un administrador activo.",
    })
  }
}

export function createMemberService() {
  return {
    async list(): Promise<TeamMember[]> {
      await delay(300)

      return mockMembers.map((member) => teamMemberSchema.parse(member))
    },

    /** El email identifica a la persona: repetirlo es un 409, y el formulario lo muestra en el campo. */
    async create(dto: CreateMemberDto): Promise<TeamMember> {
      await delay(500)

      if (mockMembers.some((member) => member.email === dto.email)) {
        throw new HttpFailure("A member with this email already exists", { kind: "http", status: 409 })
      }

      const nextId = Math.max(0, ...mockMembers.map((member) => member.id)) + 1
      const created = teamMemberSchema.parse({ id: nextId, ...dto, active: true })
      mockMembers = [...mockMembers, created]

      return created
    },

    /**
     * El email identifica a la persona (409 sin mensaje: el formulario lo marca en el campo). Al último
     * administrador activo no se le puede quitar el rol: 409 con mensaje, que se muestra tal cual.
     */
    async update(id: number, dto: CreateMemberDto): Promise<TeamMember> {
      await delay(500)

      const member = findMember(id)

      if (mockMembers.some((item) => item.id !== id && item.email === dto.email)) {
        throw new HttpFailure("A member with this email already exists", { kind: "http", status: 409 })
      }

      if (dto.role !== ADMIN_ROLE) assertNotLastAdmin(member)

      const updated = { ...member, ...dto }
      mockMembers = mockMembers.map((item) => (item.id === id ? updated : item))

      return updated
    },

    async setActive(id: number, active: boolean): Promise<TeamMember> {
      await delay(300)

      const member = findMember(id)
      if (!active) assertNotLastAdmin(member)

      const updated = { ...member, active }
      mockMembers = mockMembers.map((item) => (item.id === id ? updated : item))

      return updated
    },

    async remove(id: number): Promise<void> {
      await delay(400)

      assertNotLastAdmin(findMember(id))
      mockMembers = mockMembers.filter((item) => item.id !== id)
    },
  }
}
