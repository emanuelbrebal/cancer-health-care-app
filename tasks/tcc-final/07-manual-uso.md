# 07 — Manual de Uso (estrutura + roteiro de capturas)

> Formato escolhido: documento com prints, separado por público. Produzir **após congelamento** (planos 02/03 concluídos) para que as capturas reflitam a versão entregue.
> Saída final: `.docx`/Google Docs no padrão do TCC (+ PDF). Este arquivo define estrutura, conteúdo e lista de telas.

## FASE 1 — Escopo

**Público:** Paciente, Cuidador (app) e Administrador (gerenciador web).
**Critérios de aceite**
1. Cada funcionalidade do RF-005 (árvore de navegação) tem ao menos 1 passo a passo com print.
2. Linguagem simples, frases curtas, sem jargão técnico (público vulnerável — RNF01).
3. Prints anotados (setas/números) com legenda "Figura N – …"; dados fictícios (nenhum dado real de usuário).
4. Seção de perguntas frequentes e de solução de problemas.
5. Um leitor que nunca usou o app conclui o roteiro "Primeiros passos" sem ajuda (teste com 1 pessoa).

## Estrutura do documento

```
1. Apresentação do OncoMente
   1.1 Para quem é · 1.2 O que o app faz e o que não faz (não substitui atendimento médico)
   1.3 Requisitos do aparelho · 1.4 Como instalar (resumo; detalhe no manual de instalação)
2. Primeiros passos
   2.1 Tela inicial e menu inferior · 2.2 Criar conta (paciente ou cuidador) e consentimento
   2.3 Entrar, sair, esqueci minha senha · 2.4 Completar perfil (ou pular)
3. Área Oncológica (sem login)
   3.1 Nutrição · 3.2 Exercícios físicos · 3.3 Sono · 3.4 Área espiritual
   3.5 Lazer: livros, filmes, séries, atividades · 3.6 Benefícios legais
4. Saúde Mental (sem login)
   4.1 Mensagens motivacionais (paciente / cuidar de quem cuida) · 4.2 Meditação
   4.3 Exercícios de respiração · 4.4 Apoio psicológico · 4.5 Estágios do luto
   4.6 Botão de emergência e discagem (CVV, CAVIDA, SAMU)
5. Área Pessoal (com login)
   5.1 Hub e "Por que coletamos esses dados?" · 5.2 Diário: escrever, editar, excluir, buscar, exportar PDF
   5.3 Tratamentos: cadastrar, editar, alterar data de término · 5.4 Calendário e progresso
   5.5 Notificações: ativar, ver histórico · 5.6 Espaço de denúncias
   5.7 Configurações: editar perfil, mudar senha, biometria, desativar conta, excluir meus dados
6. Mascote virtual
   6.1 Conversar · 6.2 Limite diário de mensagens · 6.3 O que o mascote pode e não pode responder
7. Gerenciador Web (Administrador)
   7.1 Acesso e login
   7.2 Painel de indicadores: filtro de período, leitura de cada KPI, "dados insuficientes", aviso não-clínico
       (Visão geral, Engajamento, Bem-estar, Tratamento, Mascote IA, Emergência, Conteúdo, Segurança)
   7.2.1 Auditoria: filtrar, ver diferenças, exportar CSV · 7.2.2 Saúde da API e código para suporte (request id)
   7.3 Conteúdo: gêneros, livros, filmes, séries, atividades (criar, editar, buscar, inativar)
   7.4 Meses de conscientização · 7.5 Mensagens diárias · 7.6 Configuração do mascote
   7.7 Usuários (buscar, alterar status, criar administrador) · 7.8 Logs de emergência e auditoria
8. Privacidade e seus direitos (LGPD em linguagem simples — plano 10)
   8.1 Por que pedimos sua permissão em cada área (Diário, Tratamentos, Mascote, dados de uso)
   8.2 Central de Privacidade: ver, conceder e revogar consentimentos · baixar meus dados · pedir correção ou exclusão
   8.3 Menores de idade: como o responsável confirma
   8.4 O mascote é uma IA: o que ele recebe e onde os dados são processados
   8.5 Emergência: a central de contatos nunca pede permissão
   8.6 Web (admin): termo do operador · documentos legais · fila de solicitações de titulares
9. Perguntas frequentes
10. Solução de problemas (sem conexão, notificações não chegam, conta bloqueada, discador não abre)
11. Contatos de suporte
```

## Roteiro de capturas

| # | Tela | Rota / origem | Estado a mostrar | Seção |
|---|---|---|---|---|
| 1 | Splash | `src/app/index.tsx` | Animação Lottie | 2.1 |
| 2 | Início | `(Home)/index.tsx` | Mensagem do dia visível | 2.1 |
| 3 | Sobre | `(Home)/About` | Versão | 1 |
| 4 | Cadastro | `(auth)/RegisterScreen.tsx` | Vazio · com erro de senha · consentimento | 2.2 |
| 5 | Login | `(auth)/LoginScreen.tsx` | Preenchido · erro · conta bloqueada | 2.3 |
| 6 | Recuperar/redefinir senha | `(auth)/ResetPassword`, `RecoverPassword` | Fluxo completo | 2.3 |
| 7 | Onboarding | `PersonalArea/OnboardingForm` | Com "Pular por agora" | 2.4 |
| 8 | Oncologia (grid) | `(Home)/Oncology/index.tsx` | — | 3 |
| 9–12 | Nutrição, Exercícios, Sono, Espiritual | `Oncology/*` | Conteúdo aberto | 3.1–3.4 |
| 13–16 | Lazer: lista e detalhe de livro/filme/série/atividade | `Oncology/Leisure/*` | Lista + detalhe | 3.5 |
| 17 | Benefícios legais | `Oncology/LegalArea` | Accordion aberto | 3.6 |
| 18 | Saúde Mental (grid + botão emergência) | `(Home)/MentalHealth/index.tsx` | Botão visível | 4 |
| 19–23 | Motivacional, Meditação, Respiração, Apoio, Luto | `MentalHealth/*` | — | 4.1–4.5 |
| 24 | Contatos de emergência + discador aberto | `MentalHealth/PanicButtonContacts` | Antes/depois de "Discar" | 4.6 |
| 25 | Hub + modal LGPD | `PersonalArea/Hub` | Modal aberto | 5.1 |
| 26–29 | Diário: lista, criar, editar, confirmar exclusão, PDF | `PersonalArea/Diary/*` | — | 5.2 |
| 30–32 | Tratamentos: lista, criar, editar | `PersonalArea/Treatment/*` | — | 5.3 |
| 33 | Calendário | `PersonalArea/Calendar` | Mês de conscientização + progresso | 5.4 |
| 34 | Notificações + notificação no sistema | `PersonalArea/Notifications` | Notificação na bandeja do Android | 5.5 |
| 35 | Denúncias | `PersonalArea/ReportsArea` | — | 5.6 |
| 36–38 | Configurações, mudar senha, desativar conta | `PersonalArea/AccountConfigurations/*` | Modal de confirmação | 5.7 |
| 39–40 | Mascote: início e conversa | `(Home)/Mascot`, `Mascot/Chat` | Conversa exemplo + limite atingido | 6 |
| 41–52 | Web: login, lista e formulário de cada recurso, mascote, usuários, logs | `apps/web` (plano 03) | Lista + formulário + confirmação | 7 |
| 53–62 | Web: 8 páginas do dashboard, Auditoria (lista + diff), Saúde da API | `apps/web` (plano 09 bloco C) | Período 30 dias com dados de seed; 1 card em "dados insuficientes" | 7.2 |
| 63 | App: toggle "Compartilhar dados de uso anônimos" | `PersonalArea/AccountConfigurations` | Ligado/desligado | 5.7 |
| 64–72 | App: modais C1 (termos + idade), C2 (responsável), C4 (Diário), C5 (Tratamentos), C6 (Mascote, 3 etapas), C7/C8 (pré-permissões), C10 (PDF), C13 (exclusão) | plano 10 L2 | Aberto | 8.1–8.4 |
| 73–74 | App: Central de Privacidade + "Baixar meus dados" | plano 10 item 12 | Lista de consentimentos | 8.2 |
| 75–77 | Web: termo do operador, documentos legais (editor + versões), fila de solicitações | plano 10 L3 | — | 8.6 |

## Checklist de execução

1. [ ] Congelar versão (tag `v1.0.0-rc`) e popular banco de staging com dados fictícios coerentes
2. [ ] Capturar prints em 1 aparelho Android padrão (≈ 6", tema claro) e no web em 1440px
3. [ ] Anotar prints (numeração de passos) e escrever passo a passo por seção
4. [ ] Revisão de linguagem simples + teste com 1 leitor leigo (critério 5)
5. [ ] Exportar `.docx` e PDF; commitar fonte em `docs/manual-uso/` — `📚 docs(manual): add user manual`

**Gate = Livre** após congelamento (dependência: planos 02 e 03).
