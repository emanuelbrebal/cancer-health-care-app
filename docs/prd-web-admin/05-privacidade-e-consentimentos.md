# PRD 05 — Privacidade e Consentimentos (visão do administrador)

## Objetivo

Dar ao responsável pelo sistema uma visão de conformidade — quantos usuários consentiram com cada finalidade e quais exclusões ocorreram — sem identificar pessoas nem expor dados de saúde.

## Contexto

No app, o consentimento é **granular e negado por padrão**, com três finalidades:

| Finalidade | O que libera no app |
|---|---|
| `HEALTH_DATA` | Diário, tratamentos e calendário |
| `AI_MASCOT` | Conversa com o mascote (processamento por IA em servidor fora do Brasil) |
| `NOTIFICATIONS` | Lembretes locais |

Cada mudança gera um registro novo (finalidade, concedido/negado, versão do termo, data). Sem registro, vale negado. Revogar bloqueia o acesso e não apaga dados; os dados só são apagados na exclusão da conta.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| W05-1 | Painel de agregados por finalidade: total de usuários, concedido, negado/nunca respondido, percentual. |
| W05-2 | Agregado por versão do termo: quantos consentimentos ativos estão em versão anterior à atual. |
| W05-3 | Na página de uma conta (PRD 04): estado atual das três finalidades e o histórico de mudanças (data, concedido/negado, versão). Somente leitura. |
| W05-4 | **O administrador não pode conceder nem revogar consentimento em nome do usuário.** Não existe essa ação no painel nem na API. |
| W05-5 | Registro de exclusões de conta: data, perfil, motivo e identificador pseudonimizado. Sem e-mail e sem nome. |
| W05-6 | Exibir a versão vigente do termo e a data em que entrou em vigor. |

## Endpoints consumidos

| Método | Rota | Estado | Observação |
|---|---|---|---|
| GET | `/consents` | **A criar** (item 5) | Estado do próprio usuário — usado pelo app, não pelo painel |
| PUT | `/consents/:purpose` | **A criar** (item 5) | Só o titular; **não usar no painel** |
| GET | `/admin/consents/summary` | **A criar** | Agregados por finalidade e por versão; exige ADMIN |
| GET | `/admin/users/:id/consents` | **A criar** | Histórico de uma conta; exige ADMIN |
| GET | `/admin/deletions?page=&limit=` | **A criar** | Lê o registro pseudonimizado de exclusões |

Os três endpoints `/admin/*` desta página não fazem parte do corte atual do backend; são trabalho novo a planejar junto com a construção do painel.

## Regras de privacidade

- Agregados com menos de 5 usuários em um grupo são exibidos como "< 5", para não permitir identificar indivíduos.
- Nenhuma tela desta área permite exportar lista nominal.
- O identificador nas exclusões é um hash com chave guardada só no servidor; o painel não consegue reverter para a pessoa.

## Critérios de aceite

1. Os totais do painel batem com a contagem direta no banco para as três finalidades.
2. Usuário recém-cadastrado aparece como "negado" nas três finalidades.
3. Não existe, em nenhuma tela, ação que altere o consentimento de terceiro; chamada direta de ADMIN a `PUT /consents/:purpose` só altera o consentimento do próprio ADMIN.
4. O registro de exclusões não contém e-mail, nome, telefone nem `userId` em claro.
5. Token de não-ADMIN recebe `403` em todas as rotas `/admin/*`.

## Fora do escopo

Edição dos textos dos termos pelo painel, fila de solicitações do titular (acesso, correção, portabilidade), relatório de impacto (RIPD), consentimento de responsável por menor de idade.
