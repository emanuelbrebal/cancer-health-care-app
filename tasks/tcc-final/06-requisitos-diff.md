# 06 — Relatório de Diferenças: Documento de Requisitos × Código

> Documento lido por completo: "VF - Documento de Requisito - OncoMente.docx" (Drive `1xDmIVpzXM6yYgXyHHUSE8VwRY4D6jere`), 335 linhas no texto extraído: seções 1–10, RF-001..026, RNF01..18, RS001..005, matriz de risco, APF, protótipo.
> Coluna "Código" = estado em 2026-10-18. Coluna "Ação" = o que mudar **no documento** (A = alterar texto, R = remover, I = incluir). Itens marcados *após plano X* só devem ser editados depois que o código final existir. Revalidar a tabela no congelamento (abr/2027).

## Estrutura do documento

| Item | Situação no doc | Situação no código | Ação |
|---|---|---|---|
| Seção 1.1 (visão geral) | Lista "Seção 5 – Matriz de rastreabilidade, Seção 6 – Segurança, Seção 7 – Risco, Seção 8 – Referências" | — | A: renumerar conforme sumário real (4 RNF, 5 Segurança, 6 Risco, 7 Rastreabilidade, 8 APF, 9 Protótipo, 10 Referências) |
| 1.2.2 Prioridades | "nas seções 4 e 5" | RFs não têm prioridade atribuída | A: aplicar prioridade (Essencial/Importante/Desejável) a cada RF também |
| 2.1 Abrangência | "notificações push-ups", "pets" | Notificações locais; um mascote IA | A: "notificações locais nativas"; "mascote virtual com IA" |
| 2.1 / RF-005 | Menu com aba "Social" | 5 abas: Início, Oncologia, Saúde Mental, Mascote, Meu Perfil (`mobile/src/app/(Home)/_layout.tsx`) | A: substituir "Social" por "Mascote"; incluir aba Início |
| Nova seção | — | Stack e arquitetura | I: "Arquitetura e tecnologias" (mobile Expo/RN, backend NestJS/Prisma/PostgreSQL, web React/Vite, IA Groq/Llama 3.3) — remete ao manual de instalação |

## Requisitos funcionais

| Req | Situação no doc | Situação no código | Ação |
|---|---|---|---|
| RF-001 | Senha ≥ 6 com maiúscula/minúscula/número/especial; campos e-mail, senha, confirmação, perfil | Código pede nome também; só `MinLength(6)` (plano 04 item 4 / 02 item 11 corrigem) | A: incluir campo "Nome" (obrigatório, 2–50); manter regra de senha *após plano 04*; incluir checkbox de consentimento LGPD |
| RF-002 | Pronome, nome, celular, nascimento, foto (PNG/JPEG/AVIF/WebP ≤ 2 MB); "Pular"; reexibir após 1 dia; dispara ao acessar fórum/notificações/diário/pet | Onboarding existe; pronome `SR/SRA/SRTA/CUSTOM/NOT_INFORMED`; foto em base64 | A: remover referência ao fórum; gatilho = 1º acesso à Área Pessoal; nome de usuário deixa de servir ao fórum; foto armazenada como base64/URL (*após plano 04 item 24*) |
| RF-003 | Status desativada/suspensa/cancelada; histórico; busca por nome | Exclusão física hoje → plano 04 itens 19–20 | A *após plano 04*: descrever desativação × exclusão LGPD total; busca disponível no gerenciador web |
| RF-004 | Senha mínima **4** (conflita com RF-001); biometria opcional | Mínimo 6; sem biometria | A: unificar em 6 + regras do RF-001; biometria conforme D2 (manter, ou rebaixar para Desejável); incluir bloqueio após 5 falhas (RS001); incluir "Esqueci minha senha" (existe: `ResetPassword`/`RecoverPassword`) |
| RF-005 | Ver estrutura | — | A: árvore real de navegação (Oncologia: Motivacional, Nutrição, Exercícios, Sono, Espiritual, Lazer, Benefícios legais; Saúde Mental: Motivacional paciente/cuidador, Meditação, Respiração, Apoio psicológico, Contatos de emergência; Área Pessoal: Hub, Diário, Calendário, Tratamentos, Notificações, Denúncias, Configurações); refazer fluxograma |
| RF-006 | Logomarca, boas-vindas, "Sobre", versão, accordions | Home + tela Sobre com versão | A: conferir accordions na Home; versão lida do app |
| RF-007 | Inclui "Meditação guiada" dentro de Autocuidados; "Área motivacional" na oncologia | Motivacional está em **Saúde Mental** (`MentalHealth/Motivational`); há Exercícios de respiração (não previsto) | A: mover motivacional para RF-012; incluir respiração; meditação permanece em Saúde Mental |
| RF-008 | Campos livro; "Gênero" seleção; IMDB citado em RF-007 | `Media` + `BookDetail` (author, page_count, eduCapesLink, visitCount); `isFree`, `whereToFind[]`, `synopsis` extras | A: incluir sinopse, gratuito, onde encontrar; remover "código IMDB"; capa por URL |
| RF-009 | Criador, temporadas, episódios, ano, gênero | `SeriesDetail` (showrunner, seasons, episodes, externalLink) | A: incluir link externo/sinopse |
| RF-010 | Diretor, ano, duração, gênero | `MovieDetail` (director, duration, externalLink) | A: idem |
| RF-011 | Tipo (esportiva, cultural, recreativa); frequência texto; "Ativo" boolean | Enum `LeisureType` (PHYSICAL, CULTURAL, SOCIAL, THERAPY, RECREATIONAL, REST); enum `FrequencyType` (DAILY…SPORADICAL); `status` enum | A: listar enums reais traduzidos; "Ativo" → status |
| RF-012 | Estágios do luto 1.a/1.b; tópicos; meditação; botão emergência | Sem telas de luto (plano 02 item 14) | A *após plano 02*: incluir Motivacional, Respiração, Apoio psicológico; manter luto |
| RF-013 | Botão só na Saúde Mental ("ou sistema todo, avaliar") | Só em Saúde Mental | A: fechar a decisão → "exibido em toda a área de Saúde Mental" |
| RF-014 | Log de auditoria (usuário, número, hora) | Inexistente → plano 04 item 15 | Manter; registrar que usuário é opcional (contatos acessíveis sem login) |
| RF-015..018 | "REMOVER" | Removido | R: excluir as linhas (não deixar "REMOVER"); remover do APF |
| RF-019 | Modal LGPD; menu: diário, calendário, mascote, denúncias | Mascote é aba própria; modal ausente (plano 02 item 13) | A: incluir Tratamentos, Notificações, Configurações; mascote fora do menu pessoal |
| RF-020 | Remédio, frequência, início (data+hora), término, médico/hospital (nome+contato) | Sem `startDate` e `hospitalContact` no banco (plano 04 item 22) | A *após plano 04*: frequência com opções reais; status Ativo/Finalizado/Cancelado |
| RF-021 | Entidade server-side com status Agendada/Enviada/Cancelada | Notificações **locais** (expo-notifications) + histórico no aparelho | A: reescrever como notificações locais geradas a partir do tratamento, gerenciadas no app; remover campos server-side |
| RF-022 | 1 por dia; exclusão física com confirmação dupla; busca título/conteúdo/data/emoção; PDF | 1/dia ✅, exclusão ✅, auditoria ✅, PDF no backend ✅; busca só título no app | Manter; *após plano 02 item 15* confirmar busca e PDF; incluir lista real de emotes (`mobile/src/constants/Emotes.ts`) |
| RF-023 | Meses de conscientização cadastrados no web; dias cumpridos/restantes | Hardcoded no app (plano 04 item 13 / 02 item 8) | Manter (código vai se adequar) |
| RF-024 | "Agente de IA"; consome calendário e tratamento; histórico de contexto | Groq `llama-3.3-70b-versatile`; contexto do usuário; `PatientSupportLog`; limite 30 msg/dia; gatilhos de emergência | A: citar provedor/modelo, limite diário, protocolo de emergência, limites de escopo (não diagnostica/prescreve) |
| RF-025 | Prompt mestre, personalidade, status, histórico de versões via admin | Prompt em arquivos `.md` (plano 04 item 16) | Manter (*após plano 04*) |
| RF-026 | Canais: MP, Ouvidoria, Polícia, Direitos Humanos | Implementado: Disque 136, ANS, Defensoria 129, Procon-AL + orientações | A: listar canais reais |
| **Novos** | — | Recuperação de senha; troca de senha; exercícios de respiração; mensagem diária; gerenciador web (login admin, dashboard, gêneros, usuários, logs, auditoria) | I: RF-027 Recuperar senha · RF-028 Alterar senha · RF-029 Exercícios de respiração · RF-030 Mensagem diária (manter via web) · RF-031 Autenticação do gerenciador web · RF-032 Manter gêneros · RF-033 Consultar trilha de auditoria (filtros, diff, export CSV) e logs de emergência · RF-034 Painel de indicadores (KPIs de engajamento, bem-estar agregado, tratamento, mascote, emergência, conteúdo, segurança) · RF-035 Monitorar saúde da API · RF-036 Gerenciar consentimentos por finalidade (modais C1–C15, revogação) · RF-037 Central de Privacidade (exportar dados, solicitar correção/exclusão) · RF-038 Consentimento do responsável para menores · RF-039 Manter documentos legais versionados (web) · RF-040 Atender solicitações de titulares com prazo de 15 dias (web) (numeração a confirmar; detalhes nos planos 09 e 10) |

## Requisitos não funcionais

| Req | Situação no doc | Código | Ação |
|---|---|---|---|
| RNF05 | Cita "tela inicial [RF-007]" e "[RF-008]" como seções informativas | Home = RF-006 | A: corrigir referências |
| RNF06 | "abrir um tópico no fórum" | Fórum removido | A: trocar por "enviar mensagem ao mascote" |
| RNF07 | 99% de disponibilidade | Depende do provedor (plano 05) | A: condicionar ao ambiente de hospedagem da instituição |
| RNF08 | Cita RF-006/RF-014/RF-025 como exclusão lógica | Referências não batem | A: citar RF-003, RF-008..011 |
| RNF09 | Diário imutável | RF-022 permite editar (D3) | A: reescrever — imutáveis: data de criação do diário e logs de auditoria |
| RNF10 | Cita "[RF-020]" para notificações | — | A: referência a RF-021 |
| RNF13 | LGPD com modais de consentimento em RF-001/RF-002 | Ausente | A *após plano 10*: consentimento por área (diário, tratamento, mascote, analytics), Central de Privacidade, direitos do titular em 15 dias |
| RNF14 | Pseudo-anonimato no fórum | Fórum removido | R |
| RNF18 | 2 últimas versões Android/iOS | Plano 02 matriz | Manter; registrar versões testadas |
| RNF16 | Auditoria "quem fez o quê e quando" | Fragmentada (`DailyLogAudit`, `UserDeletionLog`); `AuditLog` unificado no plano 09 | A *após plano 09*: citar `AuditLog`, eventos de segurança e a política de retenção escalonada (acesso 12 meses com base no Marco Civil art. 15; auditoria admin 5 anos; analytics 180 dias) |
| Novos | — | — | I: RNF19 Portabilidade de implantação (Docker); RNF20 Limite de uso da IA (rate limit/30 msg dia); RNF21 Configuração por ambiente; RNF22 Observabilidade (logs estruturados com request id, health checks, métricas de latência/erro); RNF23 Privacidade de indicadores (só agregados, k ≥ 5, pseudonimização, retenção por tipo de dado); RNF24 Desempenho do painel (< 2 s com 100k eventos) |

## Segurança, risco, rastreabilidade, APF, protótipo

| Item | Situação no doc | Código | Ação |
|---|---|---|---|
| RS001 | Senha forte + hash + bloqueio após 5 falhas | Hash ✅; bloqueio e política *após plano 04* | Manter |
| RS002 | Fórum citado; criptografia em repouso do diário | Ownership ✅; roles e cripto *após plano 04* | A: remover fórum |
| RS003 | "Evitar salvar dados em sessões locais" | Token em AsyncStorage (persist do Zustand); diário/tratamento com cache local | A: reescrever — token em armazenamento seguro (avaliar mover para SecureStore) e HTTPS obrigatório |
| RS004 | Fórum citado | ValidationPipe whitelist *após plano 04* | A: remover fórum |
| RS005 | Política + consentimento só no cadastro rápido/progressivo | Nenhum consentimento hoje; plano 10 cria consentimento granular por área (C1–C15) | A *após plano 10*: consentimento específico por finalidade (LGPD art. 11 I), registro com prova (art. 8º §2º), revogação, menores (art. 14), transferência internacional da IA (art. 33) |
| **Novo RS006** | — | Contexto enviado à Groq (EUA) | I: perigo = vazamento/uso indevido de dado sensível por terceiro estrangeiro; solução = consentimento específico, minimização do contexto, nunca enviar o texto do diário |
| **Novo RS007** | — | Usuários menores de idade | I: perigo = tratamento de dados de criança sem responsável; solução = verificação de idade e consentimento parental |
| **Nova seção "Conformidade legal"** | — | Plano 10 | I: tabela norma → requisito (LGPD, Marco Civil, ECA, LBI, Lei 13.819/2019, Lei 14.238/2021, Leis 12.732/2012 e 13.896/2019, Lei 9.610/1998, Res. CFM 2.314/2022, Res. CFP 11/2018, CDC); anexos: Política de Privacidade, Termos de Uso, Aviso de IA, ROPA, RIPD |
| Matriz de risco | Só RS001–RS005 | — | A: reavaliar probabilidades após mitigação (ex.: RS002 de Frequente para Ocasional) |
| Matriz de rastreabilidade (planilha externa) | RF-015..018 presentes (presumível) | — | A: atualizar planilha `1EFqhF0j…` — **Confiança: LOW**, não li a planilha |
| APF | Total "somar novamente 735"; RF-003 tem soma 15+7+5+4+4 = **35** mas total 30 | Soma dos totais listados = 609; com RF-003 corrigido = **614** | A: recalcular, corrigir RF-003 e incluir os RFs novos |
| APF RF-024 | "Recurso de gamificação" | — | A: "Recurso de IA" (coerente com RF-024) |
| Protótipo | Itens 1–9 com numeração pulando (6 ausente; 8 duplicado); fórum | — | A: substituir por prints da versão final (reaproveitar capturas do manual de uso) |
| Referências | Link do Google com redirect | — | A: formato ABNT; incluir Lei 12.732/2012, Lei 14.238/2021, LGPD 13.709/2018, Súmula 443 TST |

## Checklist de execução (docs)

1. [ ] Aplicar já os itens sem dependência (estrutura, fórum, RNF05/06/08/10/14, APF, referências)
2. [ ] Após planos 02/03/04: revisar linhas marcadas *após plano X* contra o código congelado
3. [ ] Atualizar planilha de rastreabilidade com RFs novos
4. [ ] Recontar APF
5. [ ] Inserir prints do protótipo final
6. [ ] Revisão ABNT/ortografia do doc (ex.: RF-020 "Data de Térmite" → "Data de Término"). Typo análogo no código, para o plano 02: "Denúncie" → "Denuncie" em `mobile/src/app/(Home)/PersonalArea/ReportsArea/index.tsx:23`

**Gate = Livre** para o item 1; itens 2–5 após o congelamento.
