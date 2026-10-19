// Smoke test do fluxo-roteiro no Expo Web (Playwright). Requer expo start --web e backend local.
// Uso: node apps/mobile/scripts/smoke-flow.mjs   (usuário de demo: CAPTURE_EMAIL / CAPTURE_PASSWORD)
import { chromium } from 'playwright';
const base = 'http://localhost:8081';
const r = await fetch('http://localhost:3000/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.CAPTURE_EMAIL ?? 'demo.ux@oncomente.com', password: process.env.CAPTURE_PASSWORD ?? 'demoux2026' }) });
const s = await r.json();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
await ctx.addInitScript((st) => {
  localStorage.setItem('oncomente-auth', JSON.stringify({ state: st, version: 0 }));
  localStorage.setItem('oncomente:soft-login-dismissed', 'x');
}, { token: s.access_token, user: s.user, isAuthenticated: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const step = async (name, fn) => { try { await fn(); console.log('PASS', name); } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); } };

await page.goto(base + '/', { waitUntil: 'networkidle' });
await step('long-press logo abre /design-system', async () => {
  const logo = page.getByText('ONCOMENTE').first();
  const b = await logo.boundingBox();
  await page.mouse.move(b.x + 5, b.y + 5); await page.mouse.down(); await page.waitForTimeout(1200); await page.mouse.up();
  await page.waitForURL('**/design-system', { timeout: 5000 });
});
await page.goto(base + '/Oncology', { waitUntil: 'networkidle' });
await step('SOS abre contatos de emergência', async () => {
  await page.getByLabel('SOS: ajuda urgente').first().click();
  await page.waitForURL('**/PanicButtonContacts', { timeout: 5000 });
  await page.getByText('CVV').first().click();
  await page.getByText('Ligar para 188').first().waitFor({ timeout: 3000 });
});
await page.goto(base + '/Oncology', { waitUntil: 'networkidle' });
await step('Oncologia → Lazer → Ver todos (livros) → detalhe → voltar', async () => {
  await page.getByLabel(/^Lazer./).click();
  await page.getByLabel('Ver todos: Livros').click();
  await page.waitForURL('**/Leisure/Books', { timeout: 8000 });
  await page.getByLabel(/^Além da Cura, de/).click();
  await page.getByText('Sinopse').waitFor({ timeout: 8000 });
  await page.goBack(); await page.waitForURL('**/Leisure/Books', { timeout: 5000 });
});
await page.goto(base + '/PersonalArea/Diary', { waitUntil: 'networkidle' });
await step('Diário lista o registro existente', async () => { await page.getByText('Dia de consulta').first().waitFor({ timeout: 8000 }); });
await step('Excluir pede confirmação e "Manter" cancela', async () => {
  await page.getByText('Dia de consulta').first().click();
  await page.getByLabel('Excluir registro Dia de consulta').click();
  await page.getByText('Excluir este registro?').waitFor({ timeout: 3000 });
  await page.getByText('Manter', { exact: true }).click();
  await page.getByText('Excluir este registro?').waitFor({ state: 'hidden', timeout: 3000 });
});
await page.goto(base + '/PersonalArea/Diary/create', { waitUntil: 'networkidle' });
await step('Novo registro valida campos vazios', async () => {
  await page.getByText('Salvar no diário').click();
  await page.getByText('Dê um título curto ao seu dia.').waitFor({ timeout: 3000 });
  await page.getByText('Cancelar', { exact: true }).click();
});
await page.goto(base + '/Mascot/Chat', { waitUntil: 'networkidle' });
await step('Chat: limpar pede confirmação', async () => {
  await page.getByLabel('Limpar conversa').click();
  await page.getByText('Apagar a conversa?').waitFor({ timeout: 3000 });
  await page.getByText('Manter', { exact: true }).click();
});
await step('Chat: sugestão envia pergunta e recebe resposta', async () => {
  await page.getByText('O que é a Lei dos 60 dias?').click();
  await page.getByText('O mascote está escrevendo…').waitFor({ timeout: 5000 });
  await page.getByText('O mascote está escrevendo…').waitFor({ state: 'hidden', timeout: 40000 });
});
console.log('pageerrors:', errors.length ? errors : 'nenhum');
await browser.close();
