# 06 — Checklist de deploy (agnóstico de provedor)

> Gerado em 2026-11-17 (`tasks/release-dod.md`, item 10). Vale para VPS própria com `docker-compose.prod.yml`
> ou para qualquer provedor que rode o `apps/backend/Dockerfile` com um Postgres 15 gerenciado.

## 1. Segredos e variáveis

O `docker-compose.prod.yml` lê o `.env` **da raiz do repositório** (não versionado). Modelo:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<senha forte>
POSTGRES_DB=oncomente

JWT_SECRET=<32+ caracteres aleatórios>
PSEUDONYM_KEY=<32+ caracteres aleatórios, diferente do JWT_SECRET>
CORS_ORIGINS=            # vazio = nenhuma origem web; preencher com a URL do painel admin quando existir

JWT_ACCESS_TTL=15m
REFRESH_TTL_DAYS=7
CONSENT_TERM_VERSION=1.0

GROQ_API_KEY=<chave da Groq>

SMTP_HOST=<host do provedor>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<usuário>
SMTP_PASS=<senha/app password>
SMTP_FROM=OncoMente <no-reply@seu-dominio>
```

Gerar segredos: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` (um valor por variável).

| Item | Como é garantido | Verificação |
|---|---|---|
| `POSTGRES_PASSWORD`, `JWT_SECRET`, `PSEUDONYM_KEY` presentes | `${VAR:?}` no compose | `docker compose -f docker-compose.prod.yml config` falha sem eles |
| `JWT_SECRET` forte | `assertStrongJwtSecret` em `apps/backend/src/main.ts` | servidor sai com código 1 se < 32 caracteres ou valor de exemplo |
| `PSEUDONYM_KEY` forte e própria | `assertPseudonymKey` em `main.ts` | servidor sai com código 1 se ausente, < 32 ou igual ao `JWT_SECRET` |
| `PSEUDONYM_KEY` estável | — | **Nunca trocar** depois do primeiro deploy: registros pseudonimizados deixam de casar |
| Segredos fora do git | `.gitignore` (`.env`, `.env.*`) | `git status` limpo após criar o `.env` |

## 2. Banco de dados

- [ ] Postgres 15 com backup automático habilitado (dados de saúde — LGPD art. 11 e 46).
- [ ] Migrations: o `Dockerfile` roda `npx prisma migrate deploy` antes de `node dist/src/main`; container não sobe se uma migration falhar.
- [ ] Banco novo testado do zero: `apps/backend/test/global-setup.ts` aplica todas as migrations no Postgres descartável a cada `npm run test:e2e`.
- [ ] **Seed bloqueado em produção** (`prisma/seed.ts` recusa `NODE_ENV=production`). Conteúdo inicial entra pelo painel admin ou por seed rodado em staging e exportado.
- [ ] Criar o primeiro usuário `ADMIN` manualmente (rotas de escrita de conteúdo exigem `ADMIN`).

## 3. Rede e exposição

- [ ] HTTPS terminado no proxy/provedor (Caddy, Nginx, load balancer); o backend escuta HTTP na porta 3000.
- [ ] Banco **sem** porta exposta (o compose prod não publica a 5432).
- [ ] `CORS_ORIGINS` só com origens web reais; o app nativo não depende de CORS.
- [ ] **Painel admin no mesmo site da API** (ex.: `admin.dominio.br` e `api.dominio.br`): o refresh do painel é cookie `HttpOnly; Secure; SameSite=Strict` em `Path=/auth/web` e não é enviado entre sites diferentes. `CORS_ORIGINS` precisa conter a URL do painel e o build do painel usa `VITE_API_URL` com a URL pública da API (HTTPS).
- [ ] Swagger desligado em produção (`setupSwagger` só fora de `production`).
- [ ] Rate limit ativo (`ThrottlerGuard` global; login 5/min, cadastro 3/min).

## 4. Serviços externos

- [ ] SMTP de produção configurado e testado com "Esqueci a senha" (sem SMTP o e-mail de redefinição não sai).
- [ ] `GROQ_API_KEY` válida; servidores da Groq ficam fora do Brasil (transferência internacional — citar na política de privacidade).

## 5. App mobile

- [ ] Trocar `https://api.oncomente.invalid` pela URL pública do backend nos perfis `preview` e `production` de `apps/mobile/eas.json` (ou definir via `eas env`).
- [ ] `APP_ENV=preview npx expo config` (em `apps/mobile`) deve passar; com o placeholder, falha de propósito.
- [ ] `eas build --profile preview --platform android` e teste em aparelho físico: login, diário, mascote, exclusão de conta.

## 6. Pós-deploy

- [ ] `GET /` responde 200.
- [ ] Cadastro → login → consentimentos (`GET /consents` com as 3 finalidades negadas).
- [ ] `docker compose logs backend` sem erros de boot.

## Rollback

- Código: subir a imagem/tag anterior (`docker compose up -d` com o commit anterior).
- Banco: as migrations não têm `down`; restaurar o backup anterior ao deploy. A migration retroativa desta rodada (`20260424000001_add_user_deletion_logs`) é idempotente (`IF NOT EXISTS`).
- `20261118000000_drop_social_area` remove as tabelas da Área Social (`Comment`, `Post`, `Topic`, `Community`). É destrutiva: se o banco de produção tiver dados nelas, fazer backup antes do deploy. Em banco novo, migrations e schema ficam sem drift.
