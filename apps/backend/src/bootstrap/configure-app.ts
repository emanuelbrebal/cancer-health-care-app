import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'common/filters/http-exception.filter';
import * as express from 'express';

/**
 * Configuração global da aplicação, compartilhada pelo bootstrap (main.ts) e pelos testes e2e,
 * para que os testes exercitem exatamente os mesmos pipes, filtros e limites de produção.
 */
export function configureApp(app: INestApplication, isProduction: boolean) {
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
}
