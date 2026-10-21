import { HttpFailure } from "core/lib/client/failure"
import { type Group, groupSchema, type SaveGroupDto, type Schedule } from "core/models/group"

/**
 * MOCK: los grupos del prototipo (`docs/prototype`), en memoria: los cambios se pierden al recargar. Cuando
 * exista el backend, cada método pasa a `crmClient` con su `decode` y los hooks y la pantalla no cambian.
 */
const weekdays = (from: string, to: string, saturday?: { from: string; to: string }): Schedule => ({
  mon: { active: true, from, to },
  tue: { active: true, from, to },
  wed: { active: true, from, to },
  thu: { active: true, from, to },
  fri: { active: true, from, to },
  sat: { active: Boolean(saturday), from: saturday?.from ?? "09:00", to: saturday?.to ?? "13:00" },
  sun: { active: false, from: "09:00", to: "13:00" },
})

let mockGroups: Group[] = [
  { id: "g1", name: "Vendedores", memberIds: [1, 2], schedule: weekdays("09:00", "18:00") },
  { id: "g2", name: "Soporte", memberIds: [3], schedule: weekdays("10:00", "19:00", { from: "10:00", to: "14:00" }) },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createGroupService() {
  return {
    async list(): Promise<Group[]> {
      await delay(300)

      return mockGroups.map((group) => groupSchema.parse(group))
    },

    async create(dto: SaveGroupDto): Promise<Group> {
      await delay(500)

      const nextNumber = Math.max(0, ...mockGroups.map((group) => Number(group.id.slice(1)))) + 1
      const created = groupSchema.parse({ id: `g${nextNumber}`, ...dto })
      mockGroups = [...mockGroups, created]

      return created
    },

    async update(id: string, dto: SaveGroupDto): Promise<Group> {
      await delay(500)

      if (!mockGroups.some((group) => group.id === id)) {
        throw new HttpFailure("Group not found", { kind: "http", status: 404 })
      }

      const updated = groupSchema.parse({ id, ...dto })
      mockGroups = mockGroups.map((group) => (group.id === id ? updated : group))

      return updated
    },

    async remove(id: string): Promise<void> {
      await delay(400)

      mockGroups = mockGroups.filter((group) => group.id !== id)
    },
  }
}
