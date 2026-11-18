# PRD 02 — Catálogo de Mídia (Livros, Filmes, Séries e Gêneros)

## Objetivo

Permitir que o administrador mantenha as recomendações de livros, filmes e séries exibidas na área de Lazer do app, sem depender de desenvolvedor.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| W02-1 | Três listas (Livros, Filmes, Séries) com título, gênero, ano, gratuito (sim/não), status e data de atualização. |
| W02-2 | Busca por título e filtros por gênero, gratuito e status (Ativo/Inativo). Paginação. |
| W02-3 | Criar item com validação no formulário igual à do backend (tabela de campos abaixo). |
| W02-4 | Editar item. Só os campos alterados são enviados; enviar formulário sem alteração não chama a API (o backend recusa corpo vazio com `400`). |
| W02-5 | Inativar item com confirmação. O item deixa de aparecer no app. |
| W02-6 | Reativar item inativo. |
| W02-7 | Título duplicado no mesmo tipo é recusado pelo banco (`title + type` é único): mostrar "Já existe um item com este título". |
| W02-8 | Gêneros: listar, criar, renomear e inativar, por tipo de mídia. Não é possível inativar gênero com itens ativos. |
| W02-9 | "Onde encontrar": lista de textos livres (ex.: nome da plataforma), adicionar e remover. |
| W02-10 | Pré-visualização do cartão como aparece no app (somente leitura). |

## Campos

| Campo | Tipo | Obrigatório | Regra (backend) | Vale para |
|---|---|---|---|---|
| `title` | texto | Sim | DTO aceita até 200; a coluna tem 150 — **limitar a 150 no painel** | Todos |
| `genreId` | seleção | Sim | UUID de gênero do mesmo tipo | Todos |
| `isFree` | booleano | Sim | — | Todos |
| `releaseYear` | inteiro | Não | — | Todos |
| `whereToFind` | lista de textos | Não | — | Todos |
| `image_path` | texto | Não no DTO; a coluna é obrigatória | Ver decisão de imagem | Todos |
| `synopsis` | texto longo | Não | **Campo não aceito hoje (G7)** | Todos |
| `author` | texto | Sim | até 100 | Livro |
| `eduCapesLink` | URL | Não | URL válida | Livro |
| `page_count` | inteiro | Não | — | Livro |
| `director` | texto | Sim | — | Filme |
| `duration` | texto | Sim | texto livre (ex.: "1h 45min") | Filme |
| `externalLink` | URL | Não | URL válida | Filme, Série |
| `showrunner` | texto | Não | até 100 | Série |
| `seasons`, `episodes` | inteiro | Não | — | Série |

`visitCount` (livro) é contador do sistema: exibir, não editar.

## Endpoints consumidos

| Método | Rota | Estado | Observação |
|---|---|---|---|
| GET | `/books`, `/movies`, `/series` | Existe | Devolve só ativos, sem paginação nem filtro (G5) |
| GET | `/books/:id` (idem) | Existe | — |
| POST | `/books` (idem) | Existe, **sem guard** (G1) | Resposta: `{ message, data }` |
| PATCH | `/books/:id` (idem) | Existe, **sem guard** (G1) | Resposta: item atualizado |
| DELETE | `/books/:id` (idem) | Existe, **sem guard** (G1) | Marca `INACTIVE` |
| GET | `/admin/{books,movies,series}?status=&search=&genreId=&page=&limit=` | **A criar** | Inclui inativos; exige ADMIN |
| PATCH | `/admin/{books,movies,series}/:id/reactivate` | **A criar** (G6) | — |
| GET/POST/PATCH/DELETE | `/genres` | **A criar** (G4) | Leitura pública; escrita ADMIN |

Atenção de contrato: `POST` devolve `{ message, data }` e `PATCH` devolve o item direto. O painel deve tratar os dois formatos (ou o backend padroniza antes).

## Decisão pendente — imagem de capa (G8)

Hoje o app escolhe a capa por um mapa local de arquivos embutidos; conteúdo novo cadastrado pelo painel aparece sem capa.

| Opção | Como funciona | Custo |
|---|---|---|
| A — URL externa (recomendada para esta versão) | Administrador cola a URL; o app carrega por `expo-image`, com imagem padrão se falhar | Baixo; depende de terceiros manterem a imagem no ar |
| B — Upload para armazenamento de objetos | Painel envia o arquivo; backend guarda e devolve a URL | Médio; exige serviço de armazenamento e limites de tamanho/tipo |

Em qualquer opção: registrar a fonte/licença da imagem (Lei 9.610/1998).

## Critérios de aceite

1. Sem token, `POST/PATCH/DELETE` devolvem `401`; com token de `PATIENT`, `403`.
2. Item criado no painel aparece no app na próxima abertura da lista correspondente.
3. Item inativado deixa de aparecer no app e aparece no painel com filtro "Inativo".
4. Formulário bloqueia envio com campos obrigatórios vazios e mostra o erro ao lado do campo.
5. Criar mídia sem gênero cadastrado orienta a criar o gênero primeiro.
6. Lista com 500 itens carrega paginada, sem travar a página.

## Fora do escopo

Importação em massa, agendamento de publicação, histórico de versões do item.
