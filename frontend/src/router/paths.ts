export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: {
    INDEX: "/dashboard",
    // Segmentos relativos a `INDEX`: los usa routes.ts para anidar cada pestaña bajo el layout del Dashboard.
    TABS: { SALES: "sales", CONVERSATIONS: "conversations" },
    SALES: "/dashboard/sales",
    CONVERSATIONS: "/dashboard/conversations",
  },
  INBOX: "/inbox",
  PIPELINE: "/pipeline",
  CONTACTS: {
    INDEX: "/contacts",
    // Segmentos relativos a `INDEX`: los usa routes.ts para anidar cada pestaña bajo el layout de Contactos.
    TABS: { CUSTOMERS: "customers", SUPPLIERS: "suppliers" },
    CUSTOMERS: "/contacts/customers",
    SUPPLIERS: "/contacts/suppliers",
  },
  CALENDAR: "/calendar",
  TASKS: "/tasks",
  BOTS: "/bots",
  TEMPLATES: "/templates",
  CAMPAIGNS: "/campaigns",
  QUICK_REPLIES: "/quick-replies",
  CATALOG: {
    INDEX: "/catalog",
    // Estática, así que gana sobre `/catalog/:sku` (por eso el SKU `IMPORT` está reservado).
    IMPORT: "/catalog/import",
    // Patrón para routes.ts; para navegar se usa `detail(sku)`, en minúscula porque el lint trata una llamada en mayúscula como un componente.
    DETAIL_ROUTE: "/catalog/:sku",
    detail: (sku: string) => `/catalog/${encodeURIComponent(sku)}`,
  },
  ORDERS: "/orders",
  REPORTS: "/reports",
  SETTINGS: {
    INDEX: "/settings",
    // Segmentos relativos a `INDEX`: los usa routes.ts para anidar cada pestaña bajo el layout de Configuración.
    TABS: { CHANNELS: "channels", TEAM: "team", GROUPS: "groups" },
    CHANNELS: "/settings/channels",
    TEAM: "/settings/team",
    GROUPS: "/settings/groups",
  },
  MY_ACCOUNT: "/my-account",
  BILLING: "/billing",
  HELP: "/help",
  PROTOTYPE: "/prototype",
  UNKNOWN: "*",
} as const
