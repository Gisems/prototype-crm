import compression from '@fastify/compress'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { parse } from 'qs'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false, routerOptions: { querystringParser: (str) => parse(str) } }),
  )
  const configService = app.get(ConfigService)
  const port = configService.getOrThrow<string>('PORT')

  app.enableCors({ origin: true, methods: 'GET, POST, PATCH, DELETE' })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))

  await app.register(compression, { encodings: ['gzip', 'deflate'] })

  await app.listen(port, '0.0.0.0')
  Logger.log(`Server is running on port ${port}`, 'Bootstrap')
}

void bootstrap()
