import { type Flow, flowSchema } from "core/models/flow"

/**
 * MOCK: los flujos del prototipo (`docs/prototype`). Los crea y edita Bots & Flujos, que todavía no existe;
 * acá solo se leen para asignarlos a un canal. Cuando exista, `list` pasa a `crmClient.get("/flows")`.
 */
const MOCK_FLOWS: Flow[] = [
  { id: "flow1", name: "Flujo de bienvenida y precio", status: "published" },
  { id: "flow2", name: "Flujo de soporte post-venta", status: "draft" },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createFlowService() {
  return {
    async list(): Promise<Flow[]> {
      await delay(300)

      return MOCK_FLOWS.map((flow) => flowSchema.parse(flow))
    },
  }
}
