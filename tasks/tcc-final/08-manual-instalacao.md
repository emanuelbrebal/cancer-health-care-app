# 08 — Manual de Instalação e Tecnologias Utilizadas (estrutura)

> Destinatário: equipe técnica da instituição que vai hospedar/distribuir. Escrever a versão final **após o plano 05** e validar com o ensaio de instalação por terceiro (plano 05 item 10).
> Saída: seção/anexo do TCC (`.docx`) + `docs/INSTALL.md` no repositório.

## FASE 1 — Escopo e critérios

1. Um técnico sem contato prévio com o projeto sobe backend + banco + web e gera o APK seguindo só o manual.
2. Toda variável de ambiente documentada (nome, obrigatória?, exemplo, efeito).
3. Tabela de tecnologias com **versões exatas lidas dos `package.json`/lockfile** no congelamento.
4. Procedimentos de operação: backup/restauração, criar admin, rotação de segredos, atualização.

## Estrutura do documento

```
1. Visão geral da arquitetura (diagrama: App móvel ↔ API REST ↔ PostgreSQL; Web admin ↔ API; API ↔ Groq; API ↔ SMTP)
2. Tecnologias utilizadas (tabela abaixo)
3. Pré-requisitos
   - Git, Node.js LTS (versão fixada em .nvmrc — a criar), npm 10+
   - Docker + Docker Compose v2 (implantação)
   - Conta Expo (EAS) para builds; Android: nada além disso; iOS: Apple Developer (TestFlight) ou Expo Go
   - Chave Groq (mascote) e conta SMTP (recuperação de senha)
4. Obter o código (clone, estrutura do monorepo)
5. Ambiente de desenvolvimento
   5.1 npm install na raiz (workspaces) · 5.2 Banco local: docker compose up -d
   5.3 Backend: .env, prisma migrate dev, seed, npm run start:dev, Swagger em /api
   5.4 Web: .env (VITE_API_URL), npm run dev
   5.5 Mobile: .env (EXPO_PUBLIC_API_URL), npx expo start, Expo Go / emulador / aparelho na mesma rede
6. Implantação em produção
   6.1 Opção A — servidor próprio com docker-compose.prod.yml (TLS, domínio, firewall)
   6.2 Opção B — PaaS de referência (Render + Neon), passo a passo com prints dos painéis
   6.3 Migrations (prisma migrate deploy) e criação do primeiro ADMIN (script)
   6.4 Verificação: GET /health, login no web, login no app
7. Distribuição do aplicativo
   7.1 Android: eas build --profile preview → APK; instalar (permitir fontes desconhecidas)
   7.2 iOS: TestFlight (eas build + eas submit) ou Expo Go
   7.3 Trocar a URL da API: novo build com EXPO_PUBLIC_API_URL
8. Variáveis de ambiente (tabela por app)
9. Observabilidade e auditoria (resumo de docs/observability/operacao.md — plano 09)
   - Logs JSON e busca por request id · /health e /health/ready · /metrics com METRICS_TOKEN
   - Perfil opcional Prometheus + Grafana no compose · retenção e jobs noturnos (rollup de KPIs, limpeza)
   - Variáveis: METRICS_TOKEN, ANALYTICS_SALT, LOG_LEVEL, RETENTION_*_DAYS (política de retenção)
   - Runbook: API fora, Groq falhando, pico de 429, banco cheio
9.1 Responsabilidades legais de quem hospeda (plano 10): papel de controlador (LGPD), nomear o encarregado e publicar o contato, revisar a Política e os Termos no web antes de abrir ao público, atender a fila de titulares em até 15 dias, seguir o plano de resposta a incidentes (comunicação à ANPD), avaliar a transferência internacional para a Groq
10. Operação: backup (pg_dump) e restauração, atualização de versão, rotação de JWT_SECRET/DIARY_ENC_KEY (cuidado: trocar a chave do diário exige migração)
10. Solução de problemas (CORS, 429, cold start, migrations pendentes, APK aponta para localhost)
11. Licenças de terceiros (gerar com license-checker)
```

## Tabela de tecnologias (versões verificadas em 2026-10-18 — reconfirmar no congelamento)

| Camada | Tecnologia | Versão (package.json) | Uso |
|---|---|---|---|
| Monorepo | Lerna + npm workspaces | lerna ^9.0.7 | Orquestração de apps/pacotes |
| Linguagem | TypeScript | mobile ~6.0.3 · web ~5.9.3 · backend ^5.9.3 | Tipagem |
| Mobile | Expo SDK | ~57.0.30 | Runtime/build |
| Mobile | React Native | 0.86.3 | UI nativa |
| Mobile | React | 19.2.3 (override na raiz) | UI |
| Mobile | Expo Router | ~57.0.28 | Navegação por arquivos |
| Mobile | Zustand | ^5.0.12 | Estado (auth persistido) |
| Mobile | Axios | ^1.13.5 | HTTP |
| Mobile | expo-notifications | ~57.0.23 | Notificações locais |
| Mobile | react-native-reanimated / worklets | 4.5.1 / 0.10.1 | Animações |
| Mobile | lottie-react-native | ^7.3.8 | Splash animado |
| Mobile | react-native-calendars | ^1.1314.0 | Calendário |
| Mobile | expo-secure-store, async-storage | ~57.0.4 / 2.2.0 | Armazenamento local |
| Build mobile | EAS Build | CLI >= 16.0.0 (`eas.json`) | APK/IPA |
| Backend | NestJS | ^11.1.18 | API REST |
| Backend | Prisma ORM | ^6.19.3 | Acesso a dados/migrations |
| Banco | PostgreSQL | 15 (`postgres:15-alpine`) | Persistência |
| Backend | Passport JWT / @nestjs/jwt | ^4.0.1 / ^11.0.2 | Autenticação |
| Backend | bcrypt | ^6.0.0 | Hash de senha |
| Backend | class-validator / class-transformer | ^0.14.3 / ^0.5.1 | Validação de DTO |
| Backend | @nestjs/throttler | ^6.5.0 | Rate limiting |
| Backend | @nestjs/swagger | ^11.4.4 | Documentação OpenAPI |
| Backend | openai SDK → Groq (`llama-3.3-70b-versatile`) | ^6.33.0 | Mascote IA |
| Backend | nodemailer | ^8.0.6 | E-mail de recuperação |
| Backend | pdfkit | ^0.18.0 | Relatório de emoções em PDF |
| Backend | Jest + Supertest | ^30 / ^7 | Testes |
| Web | React + Vite | ^19.1.0 (override 19.2.3) / ^7.3.1 | Painel admin |
| Web | (a definir no plano 03) | — | Router, React Query, RHF, Zod, UI kit |
| Web | Recharts + react-is (plano 09) | 3.10.x / 19.2.3 (fixar exata na instalação) | Gráficos do dashboard |
| Backend | nestjs-pino + pino-http | 5.3.x / 11.0.x | Logs estruturados |
| Backend | @nestjs/terminus | 12.1.x | Health checks |
| Backend | prom-client | 15.1.x | Métricas |
| Backend | @nestjs/schedule | ^6.1.1 (já instalado) | Rollup de KPIs e retenção |
| Infra | Docker / Compose | — | Empacotamento e implantação |
| Runtime | Node.js | Dockerfile usa `node:20-alpine` | ⚠️ Node 20 saiu de suporte (EOL abr/2026) → migrar para 22 LTS ou 24 LTS no plano 05 e fixar em `.nvmrc` |

## Checklist de execução

1. [ ] Criar `.nvmrc` e atualizar imagem base do Dockerfile para Node LTS suportado — `🔧 chore(ci): bump node to supported lts`
2. [ ] Gerar tabela de versões a partir dos lockfiles no congelamento (script simples `npm ls --depth=0 --json`)
3. [ ] Escrever `docs/INSTALL.md` seguindo a estrutura — `📚 docs(install): add installation manual`
4. [ ] Diagrama de arquitetura (exportar PNG para o TCC)
5. [ ] Ensaio por terceiro (plano 05 item 10) e correções
6. [ ] Converter para o padrão do TCC (`.docx`)

**Gate = Livre** após plano 05.
