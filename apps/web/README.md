# OncoMente — Gerenciador web

Painel administrativo (role `ADMIN`) para manter o conteúdo exibido no app e dar suporte a contas.
Comportamento: `docs/prd-web-admin/` (PRDs 01–04). Visual: Figma "Modelo base p/ gerenciador web"
(tokens e node-ids em `tasks/gerenciador-web.md`, seção "Tokens do Figma").

Base: portado do [CarlosWGama/admin-template](https://github.com/CarlosWGama/admin-template) (Next.js 15)
para React 19 + Vite 7. O template não declara licença; o uso como base foi autorizado para o projeto.

## Rodar

```bash
cp apps/web/.env.example apps/web/.env   # VITE_API_URL=http://localhost:3000
npm run start:backend                    # API em :3000
npm run start:web                        # painel em http://localhost:5173
```

Entre com o admin do seed (`apps/backend/prisma/seed.ts`). Use **localhost** e não o IP da rede: o
cookie de sessão é `Secure`, e o navegador só o aceita em `http` quando o host é `localhost`
(para acessar por IP em dev, rode o backend com `COOKIE_SECURE=false`).

| Comando (raiz) | O quê |
|---|---|
| `npm run build -w web` | `tsc -b` + build do Vite |
| `npm run lint -w web` | ESLint |
| `npm run test -w web` | Vitest (unidade e componentes) |

## Sessão (PRD 01)

- `POST /auth/web/login|refresh|logout` (só ADMIN). O refresh token fica em cookie
  `oncomente_admin_rt` (`HttpOnly; Secure; SameSite=Strict; Path=/auth/web`) e nunca chega ao JS.
- Access token e usuário só em memória (`src/store/session.ts`, Zustand sem `persist`). F5 restaura
  a sessão pelo cookie.
- `src/services/http.ts`: Bearer nas rotas da API; em `401`, uma única renovação compartilhada
  (single-flight) e um retry; se falhar, volta ao login com `?next=`.
- Header `X-Requested-With: oncomente-admin` obrigatório nas rotas `/auth/web/*` (CSRF).
- 30 min sem interação encerram a sessão.

## Estrutura

```
src/
  components/ui/   kit portado do template (botão, campo, select, modal, tabela) com tokens do Figma
  layouts/         AuthLayout, AdminLayout (menu lateral), PageHeader, nav.ts
  routes/          router, paths, RequireAdmin (guard de UX; a autorização é do backend)
  services/        http (axios + interceptor), auth, content, users, errors
  features/        regras puras: diff de PATCH (content), máscara de e-mail (users)
  pages/           auth, home, account, content, users
  index.css        @theme com os tokens do Figma (nenhuma cor hex fora dele)
```

## Limites desta versão

Ações sem backend aparecem como "Em breve" desabilitadas: criar mídia (gêneros, G4), suspender conta
(W04-4). Fora do escopo: inativos e reativar, `synopsis`, consentimentos (PRD 05), upload de imagem.
Lista completa em `tasks/gerenciador-web.md` → "Riscos e pendências".
