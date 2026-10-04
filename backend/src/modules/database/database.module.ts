import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const schema = configService.getOrThrow<string>('POSTGRES_SCHEMA')

        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('POSTGRES_HOST'),
          port: Number(configService.getOrThrow<string>('POSTGRES_PORT')),
          database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
          username: configService.getOrThrow<string>('POSTGRES_USERNAME'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          schema,
          extra: { options: `-c search_path=${schema}` },
          // El search_path excluye `public`, donde vive uuid-ossp, así que uuid_generate_v4() no se resuelve.
          // gen_random_uuid() está en pg_catalog (core desde PG13) y siempre es visible.
          uuidExtension: 'pgcrypto',
          synchronize: configService.get<string>('POSTGRES_SYNCHRONIZE') === 'true',
          ssl: configService.get<string>('POSTGRES_SSL') === 'true' ? { rejectUnauthorized: true } : false,
          autoLoadEntities: true,
          timezone: 'Z',
          dateStrings: true,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
