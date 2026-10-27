# ChatG2I — CRM Multicanal (Prototipo)

Prototipo frontend de un CRM multicanal (WhatsApp / Instagram / Messenger) para gestionar conversaciones, leads, pedidos y campañas desde un solo lugar.

**Demo en vivo:** https://prototype-crm-seven.vercel.app/

```
Email:      info@g2i.com
Contraseña: @Testcrm
```

## Qué es esto

Todo el proyecto vive en **un único archivo HTML** (`frontend/public/prototype/index.html`) con CSS y JavaScript vanilla embebidos — sin frameworks, sin build step, sin backend. Todo el estado corre en memoria del navegador (no hay base de datos ni persistencia real): es una referencia de comportamiento y diseño para construir el producto real más adelante.

Para el detalle completo de qué incluye cada sección, el sistema de diseño y el modelo de datos, ver [`docs/prototype/resumen-proyecto-chatg2i.md`](./docs/prototype/resumen-proyecto-chatg2i.md).

## Funcionalidades principales

- **Dashboard** con KPIs, ranking de vendedores y gráficos.
- **Inbox** multicanal con bot por palabra clave, asignación de conversaciones y panel de contexto del contacto.
- **Etapas de venta** (kanban drag & drop).
- **Contactos**, **Calendario** y **Tareas** ligadas a contactos.
- **Bots & Flujos**: editor visual de flujos con nodos de disparador, condición, acción, mensaje y API.
- **Plantillas de Meta**, **Campañas** y **Pedidos**.
- **Reportes** exportables a CSV.
- **Configuración**: canales, equipo, grupos y horarios de atención.
- **Mi cuenta**, con **cierre de sesión** que vuelve a la pantalla de login.

## Correr el proyecto localmente

Es un HTML estático — no hace falta instalar nada. Alcanza con abrir `frontend/public/prototype/index.html` directo en el navegador, o correr `pnpm dev:front` y entrar a `/prototype`.

Para ver los cambios en vivo mientras editás:

```bash
npx live-server
```

(o la extensión **LiveServer** si estás en el editor Zed).

## Monolito (en construcción)

El repo también aloja la versión real del producto, que se irá construyendo tomando `frontend/public/prototype/index.html` como referencia:

```
backend/    NestJS + Fastify + TypeORM (PostgreSQL)   → pnpm dev:back  (5080)
frontend/   React Router (SPA) + Vite + Tailwind     → pnpm dev:front (5008)
frontend/public/prototype/   prototipo original en HTML, visible en http://localhost:5008/prototype
```

Más detalle en [`CLAUDE.md`](./CLAUDE.md).

### Levantar el front y el back

Requisitos: Node ≥ 24.9, pnpm 11 y una base PostgreSQL accesible para el backend.

1. Instalar dependencias (desde la raíz):

   ```bash
   pnpm install
   ```

2. Crear los `.env` a partir de los ejemplos:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   En `backend/.env` hay que completar los datos de conexión a PostgreSQL (una clave que falta hace fallar el arranque). En `frontend/.env`, `VITE_API_URL` debe apuntar al backend (`http://localhost:5080`).

3. Levantar cada uno en su propia terminal, desde la raíz:

   ```bash
   pnpm dev:back    # backend  → http://localhost:5080
   pnpm dev:front   # frontend → http://localhost:5008
   ```

Otros comandos útiles:

```bash
pnpm check   # lint + formato + typecheck (antes de pushear)
pnpm fix     # corrige lint y formato
pnpm build   # build de ambos paquetes
```

## Deploy

Por ahora no hay deploy: el prototipo ya no está en la raíz, así que Vercel dejará de encontrar un `index.html` en el próximo push a `main`. Cuando se despliegue, el prototipo quedará en la ruta `/prototype` del frontend.
