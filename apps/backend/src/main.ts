import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  assertStrongJwtSecret(isProduction);

  const app = await NestFactory.create(AppModule);
  // Autenticação é por Bearer token (sem cookies). Em produção só entram as origens de
  // CORS_ORIGINS (Expo Web e painel admin); o app nativo não depende de CORS.
  const corsOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins?.length ? corsOrigins : !isProduction });
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  // whitelist descarta campos fora do DTO: impede alterar role, password ou userId pelo corpo.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  if (!isProduction) setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

function assertStrongJwtSecret(isProduction: boolean) {
  if (!isProduction) return;
  const secret = process.env.JWT_SECRET ?? '';
  if (secret.length < 32 || secret.startsWith('change-this')) {
    throw new Error(
      'JWT_SECRET fraco ou de exemplo. Em produção use um valor aleatório com 32+ caracteres.',
    );
  }
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('OncoMente Backend API')
    .setDescription(
      'Documentação oficial da API REST do ecossistema OncoMente. Fornece os endpoints de integração para o aplicativo móvel e gerenciador web, abrangendo gestão de usuários, registros de diário virtual, controle de mídia (livros, filmes, séries) e suporte assistencial via Inteligência Artificial.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
