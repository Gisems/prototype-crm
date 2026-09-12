# ChatG2I — CRM Multicanal (Prototipo)

Prototipo frontend de un CRM multicanal (WhatsApp / Instagram / Messenger) para gestionar conversaciones, leads, pedidos y campañas desde un solo lugar.

**Demo en vivo:** https://prototype-crm-seven.vercel.app/

```
Email:      info@g2i.com
Contraseña: @Testcrm
```

## Qué es esto

Todo el proyecto vive en **un único archivo HTML** (`index.html`) con CSS y JavaScript vanilla embebidos — sin frameworks, sin build step, sin backend. Todo el estado corre en memoria del navegador (no hay base de datos ni persistencia real): es una referencia de comportamiento y diseño para construir el producto real más adelante.

Para el detalle completo de qué incluye cada sección, el sistema de diseño y el modelo de datos, ver [`resumen-proyecto-chatg2i.md`](./resumen-proyecto-chatg2i.md).

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

Es un HTML estático — no hace falta instalar nada. Alcanza con abrir `index.html` directo en el navegador.

Para ver los cambios en vivo mientras editás:

```bash
npx live-server
```

(o la extensión **LiveServer** si estás en el editor Zed).

## Deploy

El repo está conectado a [Vercel](https://vercel.com) como sitio estático — cualquier push a `main` se despliega automáticamente en la URL de arriba.
