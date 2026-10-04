# CLAUDE.md

## Overview

ChatG2I es un CRM multicanal (WhatsApp / Instagram / Messenger). Este repo es un **monolito pnpm** con dos paquetes:

- `backend/` — NestJS 12 sobre **Fastify**, TypeORM + PostgreSQL, ESM (`nodenext`: los imports relativos llevan `.js`).
- `frontend/` — React 19 + React Router 8 en **modo SPA** (`ssr: false`, `appDirectory: "src"`), Vite, Tailwind 4, TanStack Query, react-hook-form + Zod, shadcn.

`docs/prototype/index.html` es el prototipo original en HTML puro y la **referencia de comportamiento y diseño**; el resumen de secciones y modelo de datos está en `docs/prototype/resumen-proyecto-chatg2i.md`. Se sirve en la ruta `/prototype` del frontend (iframe sobre `public/prototype/`); por ahora no se despliega en Vercel. La configuración viene de `mono-openmed-clinic` (back) y `clinic-portal` (front), recortada a lo necesario: sin auth, PWA, Cloudflare, Observe ni `@openmed-pe/common-back`.

## Commands

Desde la raíz (`pnpm -r` sobre ambos paquetes):

```bash
pnpm dev:back      # nest start --watch  (puerto 5080)
pnpm dev:front     # react-router dev    (puerto 5008)
pnpm check         # lint + fmt:check + typecheck — antes de pushear
pnpm fix           # lint:fix + fmt
pnpm build
pnpm knip
```

Un paquete suelto: `pnpm --filter @g2i/crm-backend <script>` o `pnpm --filter @g2i/crm-frontend <script>`. Tests del back: `pnpm --filter @g2i/crm-backend test` (vitest + SWC; el front no tiene runner todavía).

Husky vive en la raíz (el `.git` es uno solo): `pre-commit` corre lint-staged por paquete + `pnpm typecheck`; `commit-msg` valida conventional commits.

## Backend

- `.env` en `backend/` (copiar de `.env.example`). Se lee con `configService.getOrThrow(...)`: una clave que falta rompe al arrancar. `POSTGRES_SYNCHRONIZE` y `POSTGRES_SSL` usan `get`; cualquier valor distinto de `'true'` los deja apagados. Toda clave nueva va a `.env.example`.
- `src/app.module.ts` es el único punto de registro de módulos. TypeORM se configura una vez en `modules/database` (`autoLoadEntities`), así que cada módulo solo hace `TypeOrmModule.forFeature`.
- Forma de un módulo: `<feature>.module.ts`, `controllers/`, `services/`, `entities/`, `dto/{create,update,response}.dto.ts`. `src/common/` es código compartido y **no importa de `@modules/*`** (lo hace cumplir el lint).
- Alias `@common/*` y `@modules/*` (tsconfig + vitest). No rutas relativas profundas.
- `typescript/consistent-type-imports` está apagada a propósito: con `emitDecoratorMetadata`, un `import type` borra la referencia y Nest inyecta `undefined`.
- oxlint es type-aware y `oxlint` va pineado en `1.85.0` junto a `oxlint-tsgolint@7.0.2002`: con la 1.86 el linter entra en pánico. No uses `^`.

## Frontend

- `.env` en `frontend/`: `VITE_API_URL` apunta al backend. `src/config/index.ts` es la única lectura de `import.meta.env`.
- `typecheck` corre `react-router typegen` primero: las rutas importan `./+types/*`.
- **Las rutas son dueñas de los datos; las secciones reciben props.** Una ruta es `app/<page>/index.tsx` hasta que se divide en `pages/<view>.tsx` + `sections/<view>/`.
- Rutas en `src/routes.ts` con strings de `PATHS` (`router/paths.ts`); ahí los imports son relativos a propósito (el loader de RR no ve los alias).
- `shared/` nunca importa de `core/` (lo hace cumplir el lint). `core/` = servicios, store, modelos de dominio; `shared/` = UI y utilidades sin dominio.
- Imports absolutos desde `src` (`core/lib/api`, `shared/...`), sin `@/`. No agregues `baseUrl` ni `esModuleInterop: false` al tsconfig.
- `shared/components/ui/` es código de shadcn tal cual se genera (`pnpm dlx shadcn add <component>`, estilo `base-nova`): no se edita a mano.
- Tokens de color en `shared/styles/globals.css`, tomados del prototipo (teal `#004952`, coral `#ed7755`, amarillo `#ffdf9f`).
- No se usan `alert()`/`confirm()`/`prompt()` nativos: modales y toasts propios.

## Conventions

- oxfmt formatea y oxlint lintea (no ESLint/Prettier). Back: comillas simples, sin `;`. Front: comillas dobles, sin `;`. 120 columnas, LF, 2 espacios. `pnpm fix` antes de commitear.
- Las reglas son estrictas a propósito: se relajan con un `override` acotado o un `oxlint-disable-next-line` con el motivo, nunca globalmente.
- Una promesa sin `await` es error de lint: `void fn()` si es a propósito.
- Commits convencionales (`feat(contacts): ...`).

## Commits y PRs

- No agregar atribución a Claude en commits ni en descripciones de PR: ni `Co-Authored-By: Claude ...` ni "Generated with Claude Code". Los commits deben quedar solo a nombre del usuario.
