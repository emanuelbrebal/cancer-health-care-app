import { execSync } from 'child_process';
import { join } from 'path';
import { loadE2eEnv } from './load-env';

// Roda uma vez antes de todas as suítes: aplica as migrations no banco de teste.
export default function globalSetup() {
  loadE2eEnv();
  execSync('npx prisma migrate deploy', {
    cwd: join(__dirname, '..'),
    env: process.env,
    stdio: 'inherit',
  });
}
