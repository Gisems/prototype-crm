import { type Faq, faqSchema } from "core/models/support"

/**
 * MOCK: el backend aún no tiene módulo de soporte, así que esto devuelve las preguntas del prototipo
 * (`docs/prototype`). Cuando exista, `list` pasa a `crmClient.get("/support/faqs", { decode })`.
 */
const MOCK_FAQS: Faq[] = [
  {
    id: 1,
    topic: "channels",
    question: "¿Cómo conecto mi WhatsApp Business?",
    answer:
      "Ve a Configuración → Canales & Bots, haz click en «Conectar» sobre WhatsApp Business API y sigue los pasos de vinculación con Meta.",
  },
  {
    id: 2,
    topic: "plan",
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí, desde Plan y facturación → «Cambiar de plan». El cambio se aplica al inicio del siguiente ciclo de facturación.",
  },
  {
    id: 3,
    topic: "team",
    question: "¿Cómo agrego un miembro nuevo al equipo?",
    answer: "En Configuración → Equipo, haz click en «+ Agregar miembro» e ingresa su nombre, email y rol.",
  },
  {
    id: 4,
    topic: "plan",
    question: "¿Qué pasa si supero el límite de mensajes de mi plan?",
    answer:
      "Te avisamos por email al llegar al 90% de uso. Puedes seguir enviando mensajes, pero se cobra un excedente por mensaje, o puedes subir de plan.",
  },
  {
    id: 5,
    topic: "bots",
    question: "¿Los bots pueden atender fuera de horario?",
    answer:
      "Sí, configura el horario de atención en Configuración → Grupos y Horarios y activa el bot en el canal correspondiente.",
  },
  {
    id: 6,
    topic: "reports",
    question: "¿Cómo exporto mis reportes?",
    answer:
      "En Reportes, cada pestaña (vendedor, etapa, etiqueta) tiene un botón «Exportar CSV» que descarga los datos filtrados.",
  },
]

/** Simula la latencia de red para que el estado de carga sea visible. */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createFaqService() {
  return {
    async list(): Promise<Faq[]> {
      await delay(300)

      return MOCK_FAQS.map((faq) => faqSchema.parse(faq))
    },
  }
}
