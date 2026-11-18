# PRDs — Painel Administrativo Web (OncoMente)

> Estado: planejamento. Nenhum código de `apps/web` foi alterado; hoje ele é o template padrão do Vite.
> O frontend oficial ainda será entregue. Estes PRDs definem **comportamento, contrato de API e regras de permissão**, não o visual.
> Base verificada no backend em 2026-11-16 (`apps/backend/src`).

## Para quem é

Usuários com role `ADMIN`: equipe responsável por alimentar e moderar o conteúdo que pacientes e cuidadores veem no app. Pacientes e cuidadores **não** usam o painel.

## Mapa dos PRDs

| # | Arquivo | Entrega | Depende de |
|---|---|---|---|
| 01 | `01-acesso-e-sessao.md` | Login do administrador, sessão, logout, rota protegida | Backend: sessão com refresh (plano `tasks/release-final.md`, item 4) |
| 02 | `02-catalogo-de-midia.md` | Livros, filmes, séries e gêneros | 01; backend: guards de ADMIN (item 3) |
| 03 | `03-atividades-de-lazer.md` | Atividades de lazer | 01; item 3 |
| 04 | `04-usuarios.md` | Consulta, suspensão e exclusão de contas | 01; backend: item 7 |
| 05 | `05-privacidade-e-consentimentos.md` | Visão agregada de consentimentos e registro de exclusões | 01; backend: itens 5 e 7 |

Ordem sugerida de construção: 01 → 02 → 03 → 04 → 05.

## Regras que valem para todos

- **Autorização é do backend.** O painel esconde o que o usuário não pode fazer, mas toda regra é validada na API (`401` sem token, `403` sem role).
- **Somente `ADMIN` entra.** Login bem-sucedido de `PATIENT` ou `CAREGIVER` é recusado no painel com mensagem neutra.
- **Nenhum dado sensível de saúde no painel.** Conteúdo do diário, tratamentos e conversas com o mascote não são exibidos nem exportados. Administrador vê contagens e estados, nunca o conteúdo.
- **Exclusão de conteúdo é lógica.** `DELETE` de mídia e lazer marca `status = INACTIVE`; o item some do app e continua no banco.
- **Toda ação destrutiva pede confirmação** e informa o efeito ("some do aplicativo imediatamente").
- **Erros da API são exibidos com a mensagem devolvida** pelo filtro global (`message`), sem stack.
- **Acessibilidade:** WCAG 2.2 AA (contraste, foco visível, rótulos, navegação por teclado). Exigido também pela Lei 13.146/2015, art. 63.
- **Idioma:** interface em pt-BR.

## Matriz de permissões

| Recurso | Anônimo | PATIENT / CAREGIVER | ADMIN |
|---|---|---|---|
| Ler mídia e lazer ativos | Sim (app) | Sim (app) | Sim |
| Criar, editar, inativar mídia e lazer | Não | Não | Sim |
| Listar usuários | Não | Não | Sim |
| Ver o próprio perfil | Não | Sim (app) | Sim |
| Suspender ou excluir conta de terceiro | Não | Não | Sim |
| Ver conteúdo de diário, tratamento ou mascote de terceiro | Não | Não | **Não** |
| Ver agregados de consentimento | Não | Não | Sim |

## Lacunas do backend (o que precisa existir antes ou junto)

| # | Lacuna | Estado hoje | Onde | Tratada em |
|---|---|---|---|---|
| G1 | Escrita de mídia e lazer sem autenticação | `POST/PATCH/DELETE` sem guard | `media/books/books.controller.ts:20-56` (idem movies, series, leisures) | `release-final` item 3 |
| G2 | `GET /users` aberto a qualquer usuário logado | Só `JwtAuthGuard` | `user/user.controller.ts:23` | item 3 |
| G3 | Sessão sem refresh nem logout no servidor | JWT único de 7 dias | `auth/auth.module.ts:23` | item 4 |
| G4 | Sem endpoints de gênero | Modelo `Genre` existe, sem controller; `genreId` é obrigatório para criar mídia | `prisma/schema/schema.prisma` | **a criar** (PRD 02) |
| G5 | Listagens sem paginação, busca ou filtro de status | `findAll()` devolve só ativos, tudo de uma vez | `media/common/base-media.repository.ts`, `leisures/leisures.repository.ts:17-19` | **a criar** (PRDs 02 e 03) |
| G6 | Não há como reativar item inativo | `DELETE` marca `INACTIVE`; nenhuma rota lê inativos | idem | **a criar** |
| G7 | `synopsis` não é aceito na criação | Coluna existe em `Media` e `LeisureActivity`; DTOs não têm o campo | `media/common/dto/CreateMediaDto.ts`, `leisures/dto/create-leisure.dto.ts` | **a criar** |
| G8 | Imagem de capa | `image_path` é texto; o app resolve capas por mapa local de arquivos | `apps/mobile/src/constants/mediaImageMap.ts` | decisão pendente (PRD 02) |
| G9 | Suspensão de conta e status do usuário | Inexistente | — | item 7 |
| G10 | Consentimentos | Inexistente | — | itens 5 e 6 |
| G11 | CORS | Aberto por padrão; precisa da origem do painel em `CORS_ORIGINS` | `main.ts:12` | item 3 |
| G12 | Administrador inicial | Criado por seed com senha padrão de desenvolvimento | `prisma/seed.ts:35` | trocar a senha no primeiro acesso em produção (PRD 01) |

## Fora do escopo destes PRDs

- Dashboard de KPIs, trilha de auditoria e saúde da API (`tasks/tcc-final/09`).
- Edição do prompt e da personalidade do mascote.
- Mensagens diárias (`DailyMessage`): modelo existe, sem endpoints e sem uso verificado no app.
- Fila de solicitações do titular (LGPD art. 18) e edição de documentos legais (`tasks/tcc-final/10`).
