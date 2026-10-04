import { resolve } from 'node:path'

import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // SWC en vez del esbuild por defecto: Nest resuelve las dependencias por tipo
  // leyendo emitDecoratorMetadata, que esbuild no implementa
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'es2023',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
  resolve: {
    alias: {
      '@common': resolve(import.meta.dirname, 'src/common'),
      '@modules': resolve(import.meta.dirname, 'src/modules'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: { include: ['src/**/*.ts'] },
  },
})
