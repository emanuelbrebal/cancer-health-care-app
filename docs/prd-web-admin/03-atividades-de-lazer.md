# PRD 03 — Atividades de Lazer

## Objetivo

Permitir que o administrador mantenha as sugestões de atividades de lazer exibidas na área Oncológica do app.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| W03-1 | Lista com nome, tipo, frequência, status e data de atualização. |
| W03-2 | Busca por nome; filtros por tipo, frequência e status. Paginação. |
| W03-3 | Criar, editar, inativar (com confirmação) e reativar. |
| W03-4 | Nome é único: duplicado mostra "Já existe uma atividade com este nome". |
| W03-5 | Tipo e frequência são listas fechadas, exibidas em português (tabela abaixo). |
| W03-6 | Aviso fixo no formulário: a atividade é uma sugestão geral e não substitui orientação da equipe de saúde. |

## Campos

| Campo | Tipo | Obrigatório | Regra (backend) |
|---|---|---|---|
| `name` | texto | Sim | até 150 |
| `type` | seleção | Sim | `PHYSICAL`, `CULTURAL`, `SOCIAL`, `THERAPY`, `RECREATIONAL`, `REST` |
| `frequency` | seleção | Sim | `DAILY`, `WEEKLY`, `FORTWEEKLY`, `MONTHLY`, `SPORADICAL` |
| `image_path` | texto | Não no DTO; a coluna é obrigatória | Mesma decisão de imagem do PRD 02 |
| `synopsis` | texto longo | Não | **Campo não aceito hoje (G7)** |

Rótulos sugeridos: Física, Cultural, Social, Terapêutica, Recreativa, Descanso · Diária, Semanal, Quinzenal, Mensal, Esporádica.

Os valores `FORTWEEKLY` e `SPORADICAL` estão assim no banco (grafia do enum). O painel envia o valor exato e mostra o rótulo em português.

**Confiança: LOW** sobre a validação de `type` e `frequency` no `CreateLeisureDto`: os decorators desses dois campos não foram conferidos linha a linha. Verificar antes de implementar o formulário.

## Endpoints consumidos

| Método | Rota | Estado | Observação |
|---|---|---|---|
| GET | `/leisures` | Existe | Só ativos, sem paginação (G5) |
| GET | `/leisures/:id` | Existe | Só ativos |
| POST | `/leisures` | Existe, **sem guard** (G1) | — |
| PATCH | `/leisures/:id` | Existe, **sem guard** (G1) | — |
| DELETE | `/leisures/:id` | Existe, **sem guard** (G1) | Marca `INACTIVE` |
| GET | `/admin/leisures?status=&search=&type=&frequency=&page=&limit=` | **A criar** | Inclui inativos; exige ADMIN |
| PATCH | `/admin/leisures/:id/reactivate` | **A criar** (G6) | — |

## Critérios de aceite

1. Sem token, escrita devolve `401`; com token de não-ADMIN, `403`.
2. Atividade criada aparece no app na lista de lazer; inativada, desaparece.
3. Nome duplicado é recusado com mensagem clara, sem perder o que foi digitado.
4. Seletores mostram rótulos em português e enviam o valor do enum.

## Fora do escopo

Segmentar atividades por tipo de câncer, fase do tratamento ou restrição médica.
