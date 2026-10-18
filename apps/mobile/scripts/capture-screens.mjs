// Captura prints das telas do fluxo-roteiro via Expo Web + Playwright.
// Uso: node scripts/capture-screens.mjs <pasta-saida> [baseUrl]
// Requer: expo start --web rodando e backend em http://localhost:3000.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] ?? 'docs/av2/prints/tmp');
const baseUrl = process.argv[3] ?? 'http://localhost:8081';
const apiUrl = process.env.CAPTURE_API_URL ?? 'http://localhost:3000';
const email = process.env.CAPTURE_EMAIL ?? 'paciente@oncomente.com';
const password = process.env.CAPTURE_PASSWORD ?? 'onco123'; // senha do seed de desenvolvimento

const shots = [
  { name: '01-inicio-modal', url: '/', auth: false },
  { name: '02-login', url: '/LoginScreen', auth: false },
  { name: '03-inicio', url: '/', auth: true },
  { name: '04-oncologia', url: '/Oncology', auth: false },
  { name: '05-lazer', url: '/Oncology/Leisure', auth: false },
  { name: '06-livros', url: '/Oncology/Leisure/Books', auth: false },
  { name: '07-beneficios-legais', url: '/Oncology/LegalArea', auth: false },
  { name: '08-saude-mental', url: '/MentalHealth', auth: false },
  { name: '09-contatos-emergencia', url: '/MentalHealth/PanicButtonContacts', auth: false },
  { name: '10-mascote-gate', url: '/Mascot', auth: false },
  { name: '11-mascote-chat', url: '/Mascot/Chat', auth: true },
  { name: '12-perfil-hub', url: '/PersonalArea/Hub', auth: true },
  { name: '13-diario', url: '/PersonalArea/Diary', auth: true },
  ...(process.env.CAPTURE_EXTRA ? JSON.parse(process.env.CAPTURE_EXTRA) : []),
];

async function getSession() {
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`login falhou: ${res.status}`);
  const data = await res.json();
  return { token: data.access_token, user: data.user, isAuthenticated: true };
}

const only = process.env.CAPTURE_ONLY?.split(',');
fs.mkdirSync(outDir, { recursive: true });
const session = await getSession();
const browser = await chromium.launch();

for (const shot of shots) {
  if (only && !only.some((o) => shot.name.startsWith(o))) continue;
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'pt-BR',
  });
  const authState = shot.auth ? session : { token: null, user: null, isAuthenticated: false };
  await context.addInitScript(({ state, flags }) => {
    localStorage.setItem('oncomente-auth', JSON.stringify({ state, version: 0 }));
    for (const [k, v] of Object.entries(flags)) localStorage.setItem(k, v);
  }, { state: authState, flags: shot.storage ?? {} });
  const page = await context.newPage();
  page.on('pageerror', (e) => console.warn(`[${shot.name}] pageerror: ${e.message}`));
  await page.goto(baseUrl + shot.url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(shot.wait ?? 2000);
  for (const step of shot.steps ?? []) {
    if (step.click) await page.getByText(step.click, { exact: false }).first().click();
    if (step.label) await page.getByLabel(step.label).first().click();
    if (step.fill) await page.getByLabel(step.fill[0]).first().fill(step.fill[1]);
    await page.waitForTimeout(step.wait ?? 1200);
  }
  const file = path.join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file });
  console.log('ok', file);
  await context.close();
}

await browser.close();
