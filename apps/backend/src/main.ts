import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configureApp } from './bootstrap/configure-app';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  assertStrongJwtSecret(isProduction);

  const app = await NestFactory.create(AppModule);
  configureApp(app, isProduction);

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
