// Auditoria WCAG 2.2 AA do painel com axe-core (não roda no CI).
// Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/axe-audit.mjs [--json saida.json]
// Requer backend (VITE_API_URL) e `npm run dev` no ar.
import { writeFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const WEB = process.env.WEB_URL ?? 'http://localhost:5173'
const API = process.env.API_URL ?? 'http://localhost:3000'
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD.')
  process.exit(1)
}
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

async function firstIds() {
  const headers = { 'Content-Type': 'application/json', 'X-Requested-With': 'oncomente-admin' }
  const login = await fetch(`${API}/auth/web/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!login.ok) throw new Error(`login na API falhou: ${login.status}`)
  const { access_token: token, user } = await login.json()
  const get = async (path) => {
    const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } })
    const body = await res.json()
    return Array.isArray(body) ? body : (body.data ?? body.items ?? [])
  }
  const users = await get('/users')
  const other = users.find((u) => u.id !== user.id) ?? users[0]
  const [book] = await get('/books')
  const [leisure] = await get('/leisures')
  return { selfId: user.id, otherUserId: other?.id, bookId: book?.id, leisureId: leisure?.id }
}

const results = []

async function audit(page, name) {
  await page.waitForLoadState('networkidle')
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  for (const v of violations) {
    results.push({
      tela: name,
      regra: v.id,
      impacto: v.impact,
      ajuda: v.help,
      alvos: v.nodes.map((n) => n.target.join(' ')),
    })
  }
  console.log(`${violations.length ? '✗' : '✓'} ${name}: ${violations.length} violação(ões)`)
}

const ids = await firstIds()
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
const page = await context.newPage()

// Telas públicas
await page.goto(`${WEB}/`)
await audit(page, 'login')
await page.getByRole('button', { name: /entrar/i }).click()
await audit(page, 'login (erros de validação)')
await page.goto(`${WEB}/esqueci-senha`)
await audit(page, 'esqueci senha')
await page.goto(`${WEB}/redefinir-senha?token=x`)
await audit(page, 'redefinir senha')

// Login
await page.goto(`${WEB}/`)
await page.getByLabel(/e-mail/i).fill(ADMIN_EMAIL)
await page.getByRole('textbox', { name: 'Senha' }).fill(ADMIN_PASSWORD)
await page.getByRole('button', { name: /entrar/i }).click()
await page.waitForURL('**/admin')

const visit = async (path, name) => {
  // Navegação interna (SPA) preserva o access token em memória.
  await page.evaluate((p) => {
    window.history.pushState({}, '', p)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, path)
  await audit(page, name)
}

await audit(page, 'início')
for (const tab of ['livros', 'filmes', 'series', 'lazer']) {
  await visit(`/admin/conteudo/${tab}`, `conteúdo: ${tab}`)
}
await visit('/admin/conteudo/lazer/novo', 'lazer: novo')
await page.getByRole('button', { name: /salvar|criar/i }).click()
await audit(page, 'lazer: novo (erros)')
if (ids.leisureId) await visit(`/admin/conteudo/lazer/${ids.leisureId}/editar`, 'lazer: editar')
if (ids.bookId) await visit(`/admin/conteudo/livros/${ids.bookId}/editar`, 'livro: editar')
await visit('/admin/usuarios', 'usuários: lista')
if (ids.otherUserId) {
  await visit(`/admin/usuarios/${ids.otherUserId}`, 'usuário: detalhe')
  const del = page.getByRole('button', { name: /excluir/i })
  if (await del.count()) {
    await del.first().click()
    await audit(page, 'usuário: modal de exclusão')
    await page.keyboard.press('Escape')
  }
}
await visit('/admin/conta', 'minha conta')
await visit('/admin/rota-inexistente', '404')

await browser.close()

console.log('\nResumo por regra:')
const byRule = new Map()
for (const r of results) {
  const key = `${r.impacto}\t${r.regra}`
  byRule.set(key, [...(byRule.get(key) ?? []), r.tela])
}
for (const [key, telas] of [...byRule].sort()) console.log(`${key}\t${[...new Set(telas)].join(', ')}`)
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 2))
process.exitCode = results.some((r) => r.impacto === 'serious' || r.impacto === 'critical') ? 1 : 0
