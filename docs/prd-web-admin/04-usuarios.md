# PRD 04 — Gestão de Usuários

## Objetivo

Dar ao administrador o mínimo para dar suporte a contas (localizar, suspender, reativar, excluir a pedido) sem expor dados de saúde.

## Princípio

Minimização (LGPD art. 6º III): o painel mostra apenas o necessário para o suporte. Diário, tratamentos e conversas com o mascote **não** são acessíveis ao administrador.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| W04-1 | Lista paginada com nome, e-mail mascarado (`m***@dominio.com`), perfil (Paciente/Cuidador/Administrador), status (Ativa/Suspensa) e data de cadastro. |
| W04-2 | Busca por e-mail exato ou nome; filtros por perfil e status. |
| W04-3 | Detalhe da conta: nome, e-mail completo (exibido sob ação "mostrar"), pronome de tratamento, perfil, status, data de cadastro, data da suspensão. Sem telefone, nascimento ou foto, salvo necessidade justificada. |
| W04-4 | Suspender conta, com motivo obrigatório e confirmação. Efeito: sessões encerradas, login bloqueado, dados preservados. |
| W04-5 | Reativar conta suspensa. |
| W04-6 | Excluir conta a pedido do titular, com motivo obrigatório e confirmação em duas etapas (digitar o e-mail). Efeito: apaga a conta e todos os dados pessoais e de saúde; fica só um registro pseudonimizado da exclusão. |
| W04-7 | Administrador não pode suspender nem excluir a própria conta, nem a última conta `ADMIN` ativa. |
| W04-8 | Administrador **não** altera a senha de terceiros; orienta o uso de "esqueci minha senha". |
| W04-9 | Administrador não altera o perfil (role) pelo painel nesta versão. |

## Endpoints consumidos

| Método | Rota | Estado | Observação |
|---|---|---|---|
| GET | `/users?limit=` | Existe, **aberto a qualquer usuário logado** (G2) | Passa a exigir ADMIN; precisa de paginação, busca e filtros |
| GET | `/users/:id` | Existe, **aberto a qualquer usuário logado** (G2) | Passa a exigir ADMIN ou dono |
| PATCH | `/users/:id` | Existe | Já restrito a dono ou ADMIN |
| DELETE | `/users/:id` | Existe | Já restrito a dono ou ADMIN; **falha para quem tem diário** (FK restritiva) — corrigido no item 7 |
| POST | `/admin/users/:id/suspend` | **A criar** (item 7) | Corpo: `{ reason }` |
| POST | `/admin/users/:id/reactivate` | **A criar** (item 7) | — |

Campos que a API devolve hoje por usuário (`UserMapper.toDto`): `id`, `name`, `email`, `role`, `pronoun`, `phone_number`, `birthday`, `profile_picture`, `createdAt`. Recomenda-se um DTO administrativo reduzido para a lista (sem telefone, nascimento e foto) e a inclusão de `status`.

## Critérios de aceite

1. Token de `PATIENT` em `GET /users` devolve `403`.
2. A lista não traz telefone, nascimento nem foto.
3. Conta suspensa não consegue entrar no app (`403 ACCOUNT_SUSPENDED`) e, ao ser reativada, mantém diário e tratamentos.
4. Após excluir, buscar o e-mail no painel não retorna nada e o usuário consegue se cadastrar de novo com o mesmo e-mail.
5. Tentar suspender a própria conta ou a última conta ADMIN é recusado com explicação.
6. Suspensão e exclusão ficam registradas com quem fez, quando e o motivo, sem dados de saúde.

## Fora do escopo

Criar usuários pelo painel, editar dados cadastrais de terceiros, exportar a base de usuários, ver conteúdo de diário, tratamento ou mascote.
