import { HttpFailure } from "core/lib/client/failure"
import { type Notice, noticeSchema } from "core/models/notice"

/**
 * MOCK: avisos de ejemplo, en memoria: lo leído se pierde al recargar. Los avisos los emite G2I (la empresa), no
 * esta app: acá solo se leen y se marcan como leídos. Cuando exista el backend, cada método pasa a `crmClient`
 * con su `decode`, y los avisos llegan solo a quienes son administradores de la cuenta.
 */
let mockNotices: Notice[] = [
  {
    id: 1,
    kind: "maintenance",
    title: "Mantenimiento programado",
    message:
      "El sistema estará en actualización el sábado 24 de octubre, de 10:00 a 11:00. Durante ese horario puede no estar disponible.",
    createdAt: "2026-10-21T09:00:00Z",
    read: false,
  },
  {
    id: 2,
    kind: "update",
    title: "Ya puedes gestionar tus contactos",
    message: "La nueva sección Contactos reúne a tus clientes y a tus proveedores en un solo lugar.",
    createdAt: "2026-10-19T14:30:00Z",
    read: false,
  },
  {
    id: 3,
    kind: "info",
    title: "Bienvenido a ChatG2I",
    message: "Desde Ayuda y soporte puedes ver las preguntas frecuentes o escribirnos directamente.",
    createdAt: "2026-10-01T12:00:00Z",
    read: true,
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createNoticeService() {
  return {
    /** Los más recientes primero. */
    async list(): Promise<Notice[]> {
      await delay(300)

      return mockNotices
        .map((notice) => noticeSchema.parse(notice))
        .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    },

    async markRead(id: number): Promise<void> {
      await delay(150)

      if (!mockNotices.some((notice) => notice.id === id)) {
        throw new HttpFailure("Notice not found", { kind: "http", status: 404 })
      }

      mockNotices = mockNotices.map((notice) => (notice.id === id ? { ...notice, read: true } : notice))
    },

    async markAllRead(): Promise<void> {
      await delay(150)

      mockNotices = mockNotices.map((notice) => ({ ...notice, read: true }))
    },
  }
}
