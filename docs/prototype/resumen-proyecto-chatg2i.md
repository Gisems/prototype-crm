# ChatG2I — Resumen del proyecto (para continuar en Claude Code)

## Qué es esto

Un **prototipo frontend completo** de un CRM multicanal (WhatsApp/Instagram/Messenger), construido como **un único archivo HTML** (`crm.html`) con CSS y JavaScript vanilla embebidos — sin frameworks, sin build step, sin backend.

**Todo el estado vive en memoria** (un objeto `state` de JavaScript). No hay persistencia, no hay base de datos, no hay integraciones reales. Es una referencia de comportamiento y diseño para construir el producto real (pensado originalmente para NestJS + Prisma + PostgreSQL en el backend).

Adjuntá el archivo `crm.html` cuando arranques la sesión en Claude Code — este resumen es el mapa, el código real está ahí.

---

## Sistema de diseño

- **Colores** (CSS custom properties en `:root`): primario teal `#004952`, acento coral `#ed7755`, secundario amarillo `#ffdf9f`, más variantes claras/oscuras de cada uno.
- **Tipografías**: Sora (títulos, vía Google Fonts) + Inter (cuerpo).
- **Componentes reutilizables ya construidos**: sistema de modales genérico (`openModal`, `openPromptModal`, `openConfirmModal`), toasts, chips de filtro, switches on/off, tablas (`table.data`), popovers.
- **Importante**: nunca se usan `alert()`, `confirm()` ni `prompt()` nativos — están **prohibidos** porque no funcionan en el sandbox de artifacts de Claude.ai. Todo pasa por los modales propios mencionados arriba.

---

## Estructura general de la app

- Sidebar colapsable (riel de íconos, expandible con un botón "☰" propio) con navegación agrupada:
  - **PRINCIPAL**: Dashboard, Inbox, Etapas de venta, Contactos, Calendario, Tareas
  - **AUTOMATIZACIÓN**: Bots & Flujos, Plantillas Meta, Campañas, Respuestas rápidas
  - **NEGOCIO**: Pedidos, Reportes, Configuración, Mi cuenta
- Pie del sidebar clickeable → lleva a "Mi cuenta".
- **Pantalla de login** cubre toda la app al cargar (ver detalle abajo).

---

## Funcionalidades construidas, por sección

### 🔐 Login / Onboarding
- Login con email/contraseña (credenciales demo: `info@g2i.com` / `@Testcrm`) o botón "Continuar con Google" (simulado, sin backend real).
- Modal de onboarding con 3 pasos sugeridos, aparece una vez tras el login.

### 📊 Dashboard
- KPIs (ventas cerradas, pedidos cerrados, ticket promedio, vendedor líder).
- Filtro de período: Hoy / Semana / Mes / Todo / **rango personalizado con calendario**.
- Ranking de vendedores (gráfico de barras + tabla) — solo cuenta pedidos pagados/entregados.
- Gráficos hechos con **SVG a mano** (sin librerías externas): barras y donut reutilizables (`drawBarChartSVG`, `drawDonutChartSVG`).
- Mensajes por canal y por humano/bot.

### 💬 Inbox
- Carpetas inteligentes (Mis chats asignados, Sin asignar, En flujo de bot activo, Sin responder, Seguimiento, No leído) + lista por miembro del equipo.
- Selector **"Viendo como"** para simular la perspectiva de cada agente.
- Tabs Todo/Humano/Bot, buscador, filtro por canal.
- Chat: envío de mensajes, **respuesta automática del bot por palabra clave** (precio/envío/horario), asignar conversación a un agente, toggle bot↔humano, marcar seguimiento (⭐), menú "⋯" (marcar no leído/resuelta/archivar), separador de fecha, indicador "Visto".
- Panel de contexto: datos del contacto, producto que más compra (calculado desde pedidos reales), campos personalizados, etiquetas, etapa de venta, notas, pedidos, y un **acordeón** (Historial de llamadas, Medios y archivos, Secuencias, Registro de errores, **Flujos/Pasos Ejecutados** — este último lee el flujo real asignado al canal).

### 🎯 Etapas de venta (antes "Pipeline", renombrado por pedido del usuario — el término técnico no era claro para usuarios no técnicos)
- Kanban drag & drop de 5 etapas (Nuevo lead → Contactado → Negociación → Ganado/Perdido).
- Clic en tarjeta abre detalle; arrastrar actualiza la etapa del contacto.

### 👥 Contactos
- Tabla con búsqueda y **filtro por etiqueta** (popover multi-selección con checkboxes).
- Ficha completa lateral: tags editables, campos personalizados, **notas**, **tareas ligadas al contacto**, historial de conversación, pedidos.

### 📅 Calendario
- Vista mensual clásica (grilla Lun-Dom), navegación de mes, botón "Hoy".
- 4 tipos de evento con color propio: Llamada, Reunión, Entrega, Recordatorio.
- Cada evento puede tener contacto vinculado, responsable, fecha/hora, notas.
- Lista de "Próximos eventos" + filtro por agente.

### ✅ Tareas
- **Bandeja propia de pendientes** por defecto ("Mis pendientes" = asignadas a Mi cuenta y no completadas).
- Carpetas: Mis pendientes, Todas, Vencidas, Para hoy, Próximas, Completadas + filtro por miembro del equipo.
- Tareas **ligadas opcionalmente a un contacto** — se ven también dentro de la ficha del contacto, sincronizadas en ambos lugares.
- Prioridad (Alta/Media/Baja), checkbox para completar sin abrir el detalle.

### ⚡ Bots & Flujos
- Canvas con **pan (arrastrar fondo) y zoom** (botones +/−/reset), minimapa.
- **5 tipos de nodo**, cada uno con sus propias salidas nombradas y coloreadas:
  - 🎯 Disparador (1 salida)
  - 🔀 Condición (una salida por rama + "Ninguna coincide" automática)
  - ⚡ Acción (lista de pasos editable, 1 salida "Continuar")
  - 💬 Mensaje de WhatsApp (vista previa real con variables `{{1}}` resaltadas; salidas Entregado/Fallo/Continuar)
  - 🌐 Solicitud de API (método + URL; salidas Éxito/Fallo)
- Botón "+" para agregar nodos, editor propio por tipo de nodo (incluye eliminar nodo).
- Lista de flujos en columna angosta a la derecha (solo nombre + ID, clickeable).
- **ID de flujo visible con botón de copiar** — pensado para integraciones por API real (`POST /api/flows/{id}/trigger`).
- Header: breadcrumb, badge Publicado/Borrador, botón Publicar, menú "⋯" (renombrar/duplicar/eliminar flujo). Deshacer/Rehacer quedaron como placeholders (toast "próximamente").

### 📄 Plantillas de Meta
- ~50 plantillas de ejemplo generadas, con **paginación** (9 por página).
- **Contador de uso** por plantilla + orden "Más recientes/Más usadas".
- Vista previa al hacer clic (mockup de burbuja de WhatsApp con variables resaltadas) antes de editar.
- Crear/editar con vista previa en vivo mientras se escribe.

### 📣 Campañas
- Selector de plantilla **visual** (no `<select>` plano): tarjeta con nombre + texto real, lista buscable al cambiar.
- Audiencia con **tarjetas clickeables** (no radios sueltos): Todos los contactos / Grupo de clientes (por etapa o etiqueta) / Lista personalizada.
- **Restringido a WhatsApp**: como las plantillas de Meta solo aplican a ese canal, toda la lógica de audiencia filtra automáticamente solo contactos de WhatsApp (no hay opción de "canal" en el agrupador).
- Programación: "Enviar ahora" o "Programar para más tarde" (fecha+hora) — si se programa, queda en estado "Programada" (sin motor de envío real, es solo el dato guardado).
- Al enviar: incrementa el contador de uso de la plantilla y deja el mensaje en el Inbox de cada contacto.

### 🛒 Pedidos
- Columna de fecha + filtros: por ID, por nombre de cliente, por canal, por rango de fecha (desde/hasta).

### 📈 Reportes
- 3 pestañas: **Por vendedor** (con filtro de período), **Por etapa**, **Por etiqueta**.
- Cada una con botón **"Exportar CSV"** que genera un archivo real vía `Blob`/`URL.createObjectURL` (con BOM UTF-8 para que Excel muestre bien los acentos).

### ⚙️ Configuración
- **Canales & Bots**: conectar/desconectar canal, activar bot, asignar flujo (de los creados en Bots & Flujos).
- **Equipo**: alta/baja de miembros, roles, activo/inactivo.
- **Grupos y Horarios**: crear grupos (ej. Vendedores, Soporte), agregarles miembros del equipo, y configurar horario de atención día por día (checkbox activo + hora desde/hasta), con badge en vivo "En horario ahora / Fuera de horario" calculado contra la hora real del sistema. Botón "Copiar horario de Lunes a Martes-Viernes".

### 👤 Mi cuenta
- Avatar (paleta de colores para cambiarlo), nombre/email editables.
- Estado **Disponible / Ausente** (pastilla tipo toggle), reflejado en el pie del sidebar.
- Cambiar contraseña (con las 3 validaciones típicas).
- Preferencias de notificación (4 switches).

---

## Modelo de datos (`state`) — entidades principales

```
state.contacts[]      // id, name, channel, tags[], stage, value, phone, assignedTo, customFields[], notes[]
state.threads{}       // por contactId: messages[], assignedTo, starred, handledBy, unread
state.orders[]        // id, contactId, channel, total, status, product, date, seller
state.templates[]     // id, name, category, status, text, usageCount
state.campaigns[]     // id, name, templateId, audienceType, audienceLabel, recipientCount, status, sentAt/scheduledAt
state.flows[]         // id, name, status, nodes[] (con type/branches/steps/templateText/method+url según tipo), connections[]
state.channels[]      // wa/ig/fb: connected, botEnabled, flowId
state.team[]          // miembros del equipo, roles
state.groups[]        // grupos de atención: memberNames[], schedule{lun..dom}
state.events[]        // calendario: date, time, title, type, contactId, assignedTo
state.tasks[]         // title, contactId, dueDate, dueTime, assignedTo, priority, status
state.myAccount       // name, email, avatarBg, status, notifications{}
state.currentUser     // agente cuya perspectiva se ve en "Viendo como" (Inbox)
```

Funciones helper importantes ya construidas: `escapeHtml`, `fmtMoney`, `agentColor`/`agentInitials`, `contactById`, `isoDate`/`formatDateDMY`, `openModal`/`openPromptModal`/`openConfirmModal`, `showToast`, `exportCSV`.

---

## Decisiones técnicas para no repetir errores

1. **Nunca usar `alert()`/`confirm()`/`prompt()`** — rotos en el sandbox de artifacts. Usar los modales propios.
2. **CSS Grid con `1fr` sin `minmax(0, ...)`** puede desbordar horizontalmente si el contenido interno no se puede achicar. Siempre usar `minmax(0, 1fr)` en columnas de grid dentro de modales/layouts.
3. **`overflow-y: auto` sin `overflow-x` explícito** puede generar scroll horizontal no deseado (regla del spec de CSS: si un eje no es `visible`, el otro se promueve a `auto`). Siempre setear `overflow-x: hidden` explícitamente en contenedores scrolleables.
4. El SVG de conexiones del flow builder debe estar **fuera** del contenedor que se transforma con pan/zoom (si no, las coordenadas se calculan mal — doble transformación).
5. Todo vive en memoria del navegador — **no usar `localStorage`/`sessionStorage`** (no soportado en artifacts). Si se necesita persistencia real de un artifact aparte, usar la API `window.storage` (`shared:false` para privado).

---

## Qué falta para ser un producto real (no está en este archivo)

Esto se había trackeado en un artifact de backlog aparte que ya se descartó — a partir de ahora cada tarea se da por completada directamente en este prototipo. Como referencia rápida de lo que falta a nivel infraestructura/backend real:

- Backend real (NestJS/Express), base de datos (PostgreSQL/Prisma), autenticación real, permisos por rol aplicados de verdad, WebSockets para tiempo real.
- Integraciones reales: WhatsApp Business API, Instagram/Messenger (Graph API), motor de ejecución real de los flujos (hoy el flow builder es solo el diagrama editable, no ejecuta nada), pasarela de pagos, logística/envíos, scheduler real de campañas programadas (cola tipo BullMQ+Redis).
- Seguridad: encriptación de datos sensibles, logs de auditoría, rate limiting de webhooks.
- Automatización real de "fuera de horario" (hoy el badge en Grupos y Horarios es solo informativo, no reasigna nada al bot).
- Responsive/mobile (el prototipo asume escritorio).
- Catálogo de productos como entidad propia (hoy el "producto" de un pedido es texto libre).

---

## Archivo

El código completo está en `crm.html` — un solo archivo, autocontenido, abrible directo en cualquier navegador.
