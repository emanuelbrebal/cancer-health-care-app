# Catálogo completo no painel: gêneros, inativos, reativar e sinopse

- Branch sugerida: `feat/AdminCatalogo` (de `main`, depois de `fix/AdminBackendFixes`)
- PRDs: `docs/prd-web-admin/02-catalogo-de-midia.md`, `03-atividades-de-lazer.md`
- Lacunas: G4, G5, G6, G7, G8 (decisão), P8 (`updatedAt`/`genreId`), P10
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 3)

---

## FASE 1 — Escopo

**Objetivo:** tirar o "Em breve" do catálogo: o admin cria mídia, gerencia gêneros, vê e reativa itens inativos, filtra e pagina no servidor, e preenche sinopse.

**Escopo — backend**
- G4: `GET /genres?type=` (público, só ativos), `POST/PATCH/DELETE /genres` (ADMIN); não inativar gênero com itens ativos (W02-8).
- G5: `GET /admin/{books,movies,series,leisures}?status=&search=&genreId=&type=&frequency=&page=&limit=` (ADMIN), incluindo inativos.
- G6: `PATCH /admin/{books,movies,series,leisures}/:id/reactivate` (ADMIN).
- G7: `synopsis` aceito nos DTOs de criação/edição de mídia e lazer.
- P8/P10: respostas admin com `updatedAt`, `genreId`, `status`; `GET /admin/…/:id` encontra inativos.
- Unicidade de mídia afrouxada (decisão 4): migration troca `@@unique([title, type])` em `Media` por unicidade por tipo — livro: título + autor; filme/série: título + ano. Ajustar o seed se ele depender da regra antiga. O `409` da sessão 2 (`rethrowUnique` em `apps/backend/common/prisma/rethrow-unique.ts`) continua valendo; só a mensagem dos livros passa a citar título e autor.

**Escopo — web**
- Tela de gêneros (lista por tipo, criar, renomear, inativar) dentro de "Conteúdo".
- Criar mídia (formulário por tipo, seleção de gênero; sem gênero → orienta criar, PRD 02 crit. 5).
- Listas usando as rotas `/admin/*`: filtros (status, gênero/tipo, gratuito, frequência), busca e paginação no servidor; colunas "status" e "atualização".
- Reativar com confirmação; editar item inativo.
- Campo sinopse nos formulários.

**Não-escopo:** upload de imagem (salvo se a pergunta 1 decidir B), importação em massa, pré-visualização do cartão (W02-10) — avaliar se cabe.

**Critérios de aceite**
1. PRD 02 crit. 1–6 e PRD 03 crit. 1–4 atendidos.
2. Rotas públicas atuais (`GET /books`, `/leisures`…) mantêm o contrato do app (só ativos, mesmo formato).
3. Item criado no painel aparece no app; reativado volta a aparecer.
4. Lista com 500 itens paginada no servidor sem travar.
5. e2e cobrindo gêneros, listagem admin com inativos, reativar e 401/403.

**Perguntas bloqueadoras**
1. **G8 — imagem de capa:** A (URL externa, recomendada no PRD 02) ou B (upload)? A exige mudança no app: carregar `image_path` remoto com fallback, em vez do mapa local `apps/mobile/src/constants/mediaImageMap.ts`. Essa mudança de mobile entra nesta sessão?
2. A sinopse aparece no app hoje? Se não, entra só no painel (dado guardado) ou também na tela de detalhe do app?
3. Pré-visualização do cartão (W02-10): dentro ou fora?

**Decisões**
4. **Unicidade de mídia — Decidido em 2026-11-26:** afrouxar `@@unique([title, type])`. Livro: único por título + autor; filme e série: únicos por título + ano. Duplicado continua `409` com `code: DUPLICATE` (helper da sessão 2). Fica nesta sessão (a sessão 2 não cria migration).

**Premissas:** coluna `synopsis` já existe em `Media` e `LeisureActivity` (PRD README, G7); `Genre { name @unique, type, status }` em `schema.prisma:134-140`.

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | `Genre` sem controller; `genreId` obrigatório | `apps/backend/prisma/schema/schema.prisma:134`, `media/common/dto/CreateMediaDto.ts:21` |
| 2 | `findAll()` só ativos, sem paginação | `media/common/base-media.repository.ts`, `leisures/leisures.repository.ts:17-19` |
| 3 | Mapa local de capas no app | `apps/mobile/src/constants/mediaImageMap.ts` |
| 4 | Front atual e "Em breve" de criar mídia | `apps/web/src/pages/content/ContentListPage.tsx` |

**Incertezas:** Confiança: LOW sobre `name @unique` global em `Genre` (impede o mesmo nome em tipos diferentes, ex.: "Drama" para filme e série). Verificar e decidir se vira `@@unique([name, type])` (migration).

---

## FASE 3 — Arquitetura

- Rotas `/admin/*` separadas das públicas (preserva o app; guard ADMIN no controller).
- Paginação offset (`page`, `limit ≤ 100`) com `{ items, total, page, limit }`.
- Web: hook de listagem com estado na URL (`?status=&page=`), para voltar à mesma página após editar.

---

## FASE 4 — Checklist de execução

1. [ ] Responder bloqueadoras; ler repositórios e schema; decidir unicidade de `Genre`.
2. [ ] Backend gêneros (+ migration se necessário) e unicidade de mídia por tipo (decisão 4: migration, seed, e2e de 409). → `✨ feat(media): add genres crud`, `🐛 fix(media): relax media title uniqueness` + e2e
3. [ ] Backend listagem admin + reativar + `GET` de inativos. → `✨ feat(media): add admin listing and reactivate`, idem `leisures` + e2e
4. [ ] Backend `synopsis` nos DTOs. → `✨ feat(media): accept synopsis`
5. [ ] Web: gêneros. → `✨ feat(web): add genres management`
6. [ ] Web: listas admin (filtros, paginação, status, reativar). → `✨ feat(web): use admin content listing`
7. [ ] Web: criar mídia + sinopse. → `✨ feat(web): add media creation`
8. [ ] (se G8 = A) Mobile: capa remota com fallback. → `✨ feat(oncology): load remote cover images`
9. [ ] Testes web + Postman + histórico. → `🧪 test(web): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [ ] Perguntas bloqueadoras respondidas (G8 muda o escopo)
- [x] Contrato público preservado (crit. 2)
- [x] Checklist ≤ 10 itens

**Gate = Rascunho**
