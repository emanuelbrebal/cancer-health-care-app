# 05 — Deploy e Distribuição

> Contexto: a instituição é quem vai disponibilizar/hospedar. Por isso o artefato principal precisa ser **portável e reproduzível por terceiros**: imagens Docker + compose. Um provedor PaaS serve de ambiente de referência (staging/banca).

## FASE 1 — Escopo

**Objetivo:** backend + banco + painel web acessíveis por HTTPS em nuvem; APK Android instalável; iOS via TestFlight ou Expo Go; todo o processo descrito para um terceiro executar sem a máquina do desenvolvedor.

**Critérios de aceite**
1. Nenhum IP/host hardcoded: mobile usa `EXPO_PUBLIC_API_URL` por perfil EAS; web usa `VITE_API_URL`; backend usa `CORS_ORIGINS`.
2. `docker compose -f docker-compose.prod.yml up -d --build` em máquina limpa sobe db + backend + web e aplica migrations.
3. API em HTTPS (RS003); `GET /health` = 200.
4. APK `preview` instalado em aparelho sem Metro faz login, lista livros e conversa com o mascote.
5. Segredos fora do repositório (`.env` no `.gitignore`, `.env.example` completo).
6. Backup do banco documentado (comando `pg_dump` + restauração testada uma vez).

## FASE 2 — Evidências

| Arquivo | Fato |
|---|---|
| `apps/backend/Dockerfile` | `CMD` aponta para `dist/main` (inexistente); prisma CLI fora do runner |
| `docker-compose.prod.yml` | Só db + backend; sem web; credencial default `postgres/postgres` |
| `apps/mobile/eas.json` | Perfis ok, sem `EXPO_PUBLIC_API_URL`; `submit.ios` incompleto |
| `apps/mobile/src/services/resolveApiBaseUrl.ts` | Fallback de produção `http://localhost:3000` |
| `apps/backend/.env.example` | Sem `CORS_ORIGINS`, `DIARY_ENC_KEY` (novas, plano 04) |

## FASE 3 — Decisão do provedor (D1)

| Opção | Backend | Banco | Web | Prós | Contras |
|---|---|---|---|---|---|
| A. Render + Neon | Web Service (Docker) | Neon Postgres | Render Static Site | Deploy por Dockerfile do repo, HTTPS automático, Neon não expira | Free tier do Render hiberna (cold start ~30–60 s) |
| B. Railway | Service (Docker) | Postgres do Railway | Static | Tudo em 1 painel | Free tier baseado em crédito — custo mensal provável |
| C. VPS (instituição ou cloud) + compose | Container | Container | Container nginx | Controle total, ideal para a instituição | Exige manter o servidor, TLS (Caddy/Traefik) e backups |

**Escolha: C como alvo de entrega + A como ambiente de referência.** O mesmo compose serve à instituição (C). A é o staging público para a banca e para os builds EAS. B descartada por custo.
**Confiança: MEDIUM** sobre limites de free tier (mudam com frequência) — conferir preços e políticas de hibernação/expiração de cada provedor na data do deploy e registrar no manual de instalação.

Mitigação do cold start (RNF05/RNF07): plano pago mínimo durante a banca, ou ping agendado em `/health` (documentar como paliativo, não como SLA de 99%).

## FASE 4 — Checklist

Branch `chore/deploy-pipeline` (backend) e `chore/mobile-eas-envs` (mobile), sem misturar.

1. [ ] Pré-requisito: plano 04 itens 7–9 (CORS, Dockerfile, validação de env) concluídos
2. [ ] `docker-compose.prod.yml`: serviço `web` (nginx com `dist/` do Vite), proxy reverso com TLS (Caddy) opcional, credenciais só via `.env`, volume de backup — `🔧 chore(ci): add web and proxy to compose`
3. [ ] Staging A: Neon (DATABASE_URL com `sslmode=require`), Render Web Service apontando para `apps/backend/Dockerfile`, Static Site para `apps/web` — registrar URLs em `08-manual-instalacao.md`
4. [ ] Rodar `prisma migrate deploy` + seed controlado (sem usuários de teste em produção; criar 1 ADMIN por script `scripts/create-admin.ts`, *a criar*) — `✨ feat(prisma): add create admin script`
5. [ ] `eas.json`: `env.EXPO_PUBLIC_API_URL` em `preview` e `production` (URL HTTPS de staging); `resolveApiBaseUrl` lança erro claro em release sem URL em vez de cair em localhost — `🔧 chore(mobile): set api url per eas profile` · `🐛 fix(services): fail fast without api url`
6. [ ] `eas build -p android --profile preview` → APK; publicar link de download (EAS ou release do GitHub) — *verif.: critério 4*
7. [ ] iOS: com Apple Developer → `eas build -p ios --profile production` + `eas submit` (TestFlight, completar `ascAppId`/`appleTeamId`); sem conta → validar que o app roda no **Expo Go** (todas as libs nativas usadas precisam estar no Expo Go; `expo-dev-client` não pode ser obrigatório) e gerar build de simulador — *verif.: smoke test iOS*
8. [ ] CI GitHub Actions: lint + tsc + test em backend/web/mobile por PR; build da imagem Docker em `main` — `🧱 ci(monorepo): add pr checks workflow`
9. [ ] Observabilidade em produção (implementação no plano 09): configurar `METRICS_TOKEN`, `ANALYTICS_SALT`, `LOG_LEVEL` no provedor; health check do PaaS apontando para `/health/ready`; perfil opcional `observability` (Prometheus + Grafana) no compose — `🔧 chore(ci): wire observability envs`
10. [ ] Ensaio de "instalação por terceiro": outra pessoa segue o `08-manual-instalacao.md` em máquina limpa; corrigir lacunas do manual

## FASE 5 — Verificação

- [x] Segredos e URLs só por ambiente
- [x] Artefato portável (compose) independente do provedor
- [x] Critérios testáveis (compose up, health, APK em aparelho)
- [x] Checklist = 10 itens
- [x] 3 opções avaliadas, escolha justificada
- [x] Pendência D6 (conta Apple) com caminho alternativo definido

**Gate = Livre para execução** após plano 04 B2.
