import { index, layout, type RouteConfig, route } from "@react-router/dev/routes"

// Relativo a propósito: React Router carga este archivo con su propio config
// loader, fuera de la resolución de alias de la app, y "router/paths" no existe ahí.
import { PATHS } from "./router/paths"

export default [
  route(PATHS.ROOT, "./app/home/index.tsx"),
  route(PATHS.PROTOTYPE, "./app/prototype/index.tsx"),
  layout("./layouts/app-auth/app-auth.tsx", [route(PATHS.LOGIN, "./app/login/index.tsx")]),
  layout("./layouts/app-layout/app-layout.tsx", [
    route(PATHS.DASHBOARD, "./app/dashboard/index.tsx"),
    route(PATHS.CONTACTS.INDEX, "./app/contacts/pages/contacts.tsx", [
      index("./app/contacts/pages/contacts/index.tsx"),
      route(PATHS.CONTACTS.TABS.CUSTOMERS, "./app/contacts/pages/contacts/customers.tsx"),
      route(PATHS.CONTACTS.TABS.SUPPLIERS, "./app/contacts/pages/contacts/suppliers.tsx"),
    ]),
    route(PATHS.CATALOG.INDEX, "./app/catalog/pages/catalog.tsx"),
    route(PATHS.CATALOG.IMPORT, "./app/catalog/pages/import.tsx"),
    route(PATHS.CATALOG.DETAIL_ROUTE, "./app/catalog/pages/product.tsx"),
    route(PATHS.HELP, "./app/help/pages/help.tsx"),
    route(PATHS.MY_ACCOUNT, "./app/account/pages/account.tsx"),
    route(PATHS.BILLING, "./app/billing/pages/billing.tsx"),
    route(PATHS.SETTINGS.INDEX, "./app/settings/pages/settings.tsx", [
      index("./app/settings/pages/settings/index.tsx"),
      route(PATHS.SETTINGS.TABS.CHANNELS, "./app/settings/pages/settings/channels.tsx"),
      route(PATHS.SETTINGS.TABS.TEAM, "./app/settings/pages/settings/team.tsx"),
      route(PATHS.SETTINGS.TABS.GROUPS, "./app/settings/pages/settings/groups.tsx"),
    ]),
  ]),
] satisfies RouteConfig
