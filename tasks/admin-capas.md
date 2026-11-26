# Capas por upload: padronização, compressão e app híbrido

- Branch sugerida: `feat/AdminCapas` (de `main`, depois de `feat/AdminCatalogo`)
- PRD: `docs/prd-web-admin/02-catalogo-de-midia.md` (G8, W02-10), `03-atividades-de-lazer.md`
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 3b)

---

## FASE 1 — Escopo

**Objetivo:** o admin envia a capa pelo painel; o backend a converte num padrão único (formato, dimensão, peso) antes de o app consumir; o app mostra a capa enviada e mantém as 33 capas empacotadas para os itens do seed.

**Decisões do usuário (2026-11-26)**
1. Upload (G8 = B), com formatação antes de chegar ao mobile, compressão e limite de peso na inclusão.
2. Armazenamento em **disco do backend**, atrás de uma interface (trocável por bucket depois). O CESMAC só precisa de um volume persistente.
3. **Híbrido:** itens do seed continuam com o mapa local do app (`mediaImageMap.ts`); só capas enviadas pelo painel vêm do servidor. Trocar a capa de um item do seed passa a usar a nova.
4. Pré-visualização só da capa, já no formato final. Cartão completo fica fora.

**Padrão da imagem** (proposto em 2026-11-26; ajustar aqui se o usuário corrigir)

| Item | Valor |
|---|---|
| Entrada aceita | JPEG, PNG, WebP; **≤ 5 MB** (validado no painel e no backend; tipo checado pelo conteúdo, não pela extensão) |
| Saída | **WebP** qualidade ~80, sem metadados (EXIF/GPS removidos), orientação EXIF aplicada |
| Livro, filme, série | **2:3 → 600×900** (app: pôster 80×120 em filmes/séries) |
| Lazer | **16:9 → 960×540** (app: largura total com `cover`, alturas 140/260) |
| Recorte | `cover` centralizado (sem distorcer); imagem menor que o alvo é ampliada até cobrir |
| Nome do arquivo | gerado pelo servidor (`uploads/covers/<uuid>.webp`); nunca o nome enviado |

**Escopo — backend**
- `POST /admin/uploads/cover?kind=book|movie|series|leisure` (ADMIN, `multipart/form-data`, campo `file`) → processa com `sharp` e devolve `{ path }`.
- Interface `CoverStorage` com implementação em disco (`UPLOAD_DIR`, padrão `./uploads`); servir `GET /uploads/*` como estático com cache longo (arquivo imutável por uuid).
- `image_path` dos DTOs aceita o `path` devolvido; ao trocar a capa, o arquivo antigo enviado pelo painel é apagado (os do seed não, pois não estão no disco).
- Erros: `413` acima de 5 MB, `415` tipo não suportado, ambos com mensagem em pt-BR e `code`.

**Escopo — web**
- Campo "Capa" com seletor de arquivo substitui "Imagem (caminho ou URL)" nos formulários de mídia e lazer.
- Validação local de tipo e peso antes do envio; pré-visualização recortada no formato final (2:3 ou 16:9).
- Opcional: reduzir no navegador antes de enviar (canvas) só para acelerar o upload; o backend continua sendo a fonte da verdade.

**Escopo — mobile**
- `getMediaImage(path)`: se `path` começa com `uploads/` → `{ uri: <baseURL da API>/<path> }`; senão, mapa local; senão, placeholder. Fallback ao placeholder se a imagem remota falhar.

**Não-escopo:** bucket externo, migrar as 33 capas do seed, sinopse no app, cartão completo de pré-visualização, edição/recorte manual pelo admin.

**Critérios de aceite**
1. Arquivo de 4 MB em PNG/JPEG vira WebP no tamanho do tipo, < 200 KB, sem EXIF.
2. 6 MB → `413`; PDF renomeado para `.jpg` → `415`; nada é gravado no disco.
3. Capa enviada aparece no app (lista e detalhe); itens do seed continuam com a capa empacotada; sem rede, o app mostra o placeholder sem quebrar.
4. Trocar a capa apaga o arquivo anterior enviado; o contrato público (`GET /books`, `/leisures`…) só muda no valor de `image_path`.
5. e2e: upload ok, 413, 415, 401/403; checklist de deploy com o volume `UPLOAD_DIR`.

**Perguntas bloqueadoras:** nenhuma; o padrão da tabela acima está proposto e pode ser corrigido antes do `/exec`.

**Premissas:** `sharp` instala em Windows (dev) e em Linux/Docker (deploy) com binários pré-compilados; `resolveApiBaseUrl` do app expõe a URL da API.

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Backend sem upload nem estáticos (sem `multer`, `sharp`, `useStaticAssets`) | `apps/backend/src`, `apps/backend/package.json` |
| 2 | Mapa local de 33 capas + placeholder | `apps/mobile/src/constants/mediaImageMap.ts` |
| 3 | Uso no app | `apps/mobile/src/app/(Home)/Oncology/Leisure/{Activities,Books,Movies,Series}/` |
| 4 | URL da API no app | `apps/mobile/src/services/resolveApiBaseUrl.ts` |

**Incertezas:** Confiança: LOW sobre servir estáticos junto com o `AllExceptionsFilter` e o prefixo global (se houver); ler `bootstrap/configure-app.ts` no item 1.

---

## FASE 3 — Arquitetura

- Processamento no servidor (fonte da verdade); o painel só pré-valida e mostra a prévia.
- `CoverStorage` (interface) → `DiskCoverStorage`; troca por bucket sem mexer nos controllers.
- Upload separado do CRUD (envia o arquivo, recebe `path`, salva o item com esse `path`): reaproveita os DTOs atuais e evita multipart no CRUD.

---

## FASE 4 — Checklist de execução

1. [ ] Ler bootstrap, DTOs de `image_path` e `getMediaImage`; instalar `multer`/`sharp`.
2. [ ] Backend: `CoverStorage` + estáticos `/uploads`. → `✨ feat(media): add cover storage`
3. [ ] Backend: `POST /admin/uploads/cover` com padronização, limites e erros. → `✨ feat(media): add cover upload` + e2e
4. [ ] Backend: apagar capa anterior ao trocar. → `✨ feat(media): replace previous cover` + e2e
5. [ ] Web: campo de capa com validação e prévia. → `✨ feat(web): add cover upload field`
6. [ ] Mobile: `getMediaImage` híbrido com fallback. → `✨ feat(oncology): load uploaded cover images`
7. [ ] Deploy checklist (`UPLOAD_DIR`, volume) + Postman + histórico. → `📚 docs(release): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [x] Decisões do usuário registradas (2026-11-26)
- [x] Mobile muda só no resolvedor de imagem
- [x] Checklist ≤ 10 itens

**Gate = Livre** (padrão de imagem confirmável antes do `/exec`)
