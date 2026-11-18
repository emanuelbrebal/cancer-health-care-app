import * as dotenv from 'dotenv';
import { join } from 'path';

// Carrega test/e2e.env por cima de qualquer .env local e garante que o banco é o de teste,
// para um e2e nunca truncar o banco de desenvolvimento.
export function loadE2eEnv() {
  dotenv.config({
    path: join(__dirname, 'e2e.env'),
    override: true,
    quiet: true,
  });
  const url = process.env.DATABASE_URL ?? '';
  if (!/_test(\?|$)/.test(url)) {
    throw new Error(
      `e2e recusado: DATABASE_URL não aponta para um banco *_test (${url}).`,
    );
  }
}

loadE2eEnv();
