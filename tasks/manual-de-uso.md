# Manual de Uso — aplicativo móvel + gerenciador web (Admin e Funcionário)

- Branch sugerida: `docs/ManualDeUso` (de `main`). O painel web já está na `main` (PR #55)
- Depende de: `tasks/gerenciador-web.md` (entregue) e, de preferência, `tasks/web-admin-validacao.md`. Sessões 3–5 do `tasks/roadmap-gerenciador-web.md` mudam telas web: o que estiver "Em breve" na hora da execução entra só como "Em breve"
- Nenhum código de produto é alterado por este plano; só `docs/` e, no máximo, um script de captura de telas.

---

## FASE 1 — Escopo

**Objetivo:** organizar o manual de uso em três documentos por público, cobrindo **todas** as funcionalidades entregues, com passos verificados contra as telas reais e prints consistentes:
- `docs/manual/mobile.md`: paciente, cuidador e visitante
- `docs/manual/web-funcionario.md`: operação diária de conteúdo (lazer e mídia) e acesso ao painel
- `docs/manual/web-admin.md`: gestão de contas, exclusões, segurança e o que mudar com as próximas entregas

**Decisão do usuário:** Funcionário = ADMIN no sistema. A separação é **por perfil de uso**, não por permissão. Cada documento abre com um aviso: "No sistema, funcionário e administrador têm o mesmo acesso; este guia cobre as tarefas do dia a dia de conteúdo."

**Escopo**
- Migrar `docs/manual-de-uso.md` (mobile, 156 linhas, nov/2026) para `docs/manual/mobile.md` com `git mv`, preservando o histórico
- Completar o mobile com o que falta frente às rotas reais e aos casos de uso UC-01..UC-35
- Escrever os dois manuais web a partir das telas entregues em `tasks/gerenciador-web.md`
- `docs/manual/README.md`: índice, público de cada manual e convenções
- Prints: mobile pelo script existente; web por script novo equivalente

**Não-escopo:** manual técnico/dev (já em READMEs e `docs/requisitos-implementados.md`); funcionalidades web ainda bloqueadas no backend (gêneros, reativar, suspensão, consentimentos), que entram só como seção "Em breve" com o motivo; DOCX (formato definido: Markdown).

**Critérios de aceite**
1. Os 3 manuais + README existem em `docs/manual/`; `docs/manual-de-uso.md` vira um stub com link para o novo local (ou é removido, com as referências em `tasks/release-final.md` atualizadas).
2. **Matriz de cobertura** (anexo no README): cada rota de `apps/mobile/src/app` e cada rota do `apps/web` aponta para uma seção do manual. Zero rotas de usuário sem seção (rotas técnicas, como `design-system.tsx`, ficam marcadas como "não se aplica").
3. Cada funcionalidade segue o modelo da Fase 3: público, onde fica (caminho de navegação), pré-requisitos (login, consentimento), passos numerados, resultado esperado, problemas comuns, print.
4. Nenhum passo descreve comportamento não verificado: cada seção tem âncora de código na matriz, e os passos web foram executados no painel rodando.
5. Linguagem: pt-BR simples, segunda pessoa, sem jargão técnico no mobile; avisos de saúde mantidos ("não substitui atendimento").
6. Funcionalidades web bloqueadas aparecem só em "Em breve", sem passo a passo.
7. Prints sem dados reais: contas demo/seed apenas; nenhum token ou e-mail pessoal visível.

**Perguntas bloqueadoras:** nenhuma. A pendência é o `docs/casos-de-uso-mobile.md`: está **não rastreado** e guardado no `stash@{0}` da `feat/HeuristicasNielsen`. Antes do item 2, recuperar e versionar (commit na branch de origem e merge/cherry-pick) ou usar a cópia no scratchpad desta sessão.

**Premissas**
- `docs/manual-de-uso.md` está correto para o estado atual (revisado em `68825eb` e `b1d87d2`).
- O script `apps/mobile/scripts/capture-screens.mjs` (Expo Web + Playwright) continua funcional; depende dos stubs em `src/web-stubs` e do CORS do backend.

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Manual mobile atual: 8 seções (Primeiros passos, Oncologia, Saúde Mental + Emergência, Meu Perfil, Mascote, Privacidade, Conta, FAQ) | `docs/manual-de-uso.md:1-156` |
| 2 | Casos de uso UC-01..UC-35 + atores (Visitante, Paciente, Cuidador) e achados de divergência | `docs/casos-de-uso-mobile.md` (stash) |
| 3 | Rotas reais do mobile: 55 arquivos `.tsx` (auth 5; Oncology com Leisure/{Activities,Books,Movies,Series}; MentalHealth 7; PersonalArea com AccountConfigurations/{ChangePassword,Privacy}, Calendar, Diary/{create,update}, Hub, Notifications, OnboardingForm, ReportsArea, Treatment/{create,update}; Mascot/Chat; About) | `apps/mobile/src/app/**` |
| 4 | Regras e mensagens do painel | `docs/prd-web-admin/01..04` |
| 5 | Telas web e recorte entregue | `tasks/gerenciador-web.md` (Fase 1 e mapeamento) |
| 6 | Captura de telas mobile: `outDir` e `baseUrl` por argumento | `apps/mobile/scripts/capture-screens.mjs:8-9` |

**Lacunas prováveis no manual mobile atual** (confirmar no item 2): Sobre (`About/`), Hub, Onboarding como fluxo próprio, Lazer em detalhe (`[id]` de livros/filmes/séries/atividades), recuperação de senha por código (UC-05), reativação de conta suspensa no login (UC-04), lembrete de medicação (UC-30), apagar conversa do mascote (UC-33).

---

## FASE 3 — Estrutura

**Decisão — organização dos documentos**

| Abordagem | Corretude | Manutenção | Uso pelo leitor |
|---|---|---|---|
| A. Um arquivo por público (3 arquivos + README), seções por área do app | 5 | 4 | 5: cada pessoa lê só o seu |
| B. Um arquivo por funcionalidade (`docs/manual/mobile/diario.md`…) | 5 | 3 (muitos arquivos, índice frágil) | 3 |
| C. Arquivo único com partes | 4 | 3 | 2: paciente esbarra no conteúdo do painel |

**Vencedora: A.** É o que foi pedido, mantém o formato do manual atual e fica fácil de virar DOCX/PDF depois.

**Modelo de seção (todas as funcionalidades)**
```
### <Nome da funcionalidade>
Para quem · Onde fica: Início › Meu Perfil › Diário · Precisa de: login + consentimento "Dados de saúde"
1. passo  2. passo  3. passo
Resultado: …
Se algo der errado: … (mensagem exata da tela)
[print: mobile/diario-01.png]
```

**Índice previsto**

`mobile.md` (atualizado a partir do atual)
1. Primeiros passos: navegação, visitante × logado, criar conta, entrar (incl. conta suspensa), recuperar senha, onboarding
2. Oncologia: autocuidados (nutrição, exercícios, sono, espiritualidade), lazer (atividades, livros, filmes, séries e detalhe), direitos do paciente
3. Saúde Mental: motivacional (paciente × cuidador), respiração, meditação, apoio psicológico, **emergência (CVV, SAMU, CAVIDA)**
4. Meu Perfil: hub, diário (criar, buscar, editar, excluir, relatório PDF), tratamentos, calendário, lembretes, notificações, discriminação/denúncia
5. Mascote Virtual: conversar, apagar conversa, limites da IA
6. Privacidade e consentimentos
7. Conta: editar perfil, trocar senha, suspender, excluir conta e dados
8. Sobre o OncoMente · 9. Dúvidas frequentes · Anexo: matriz rota → seção

`web-funcionario.md`
1. Acesso: entrar, sair, esqueci minha senha, trocar senha, sessão que expira (30 min), mensagens de erro (incorreto, muitas tentativas, conta suspensa)
2. Navegação: menu, página inicial, busca e filtros nas listas
3. Atividades de lazer: cadastrar, editar, inativar; tipos e frequências; aviso de saúde
4. Livros, filmes e séries: consultar, editar, inativar; "onde encontrar"
5. Boas práticas de conteúdo: linguagem acolhedora, imagem por URL com fonte/licença (Lei 9.610/1998), conteúdo sem custo
6. Em breve: cadastrar mídia (gêneros), reativar itens, sinopse · FAQ

`web-admin.md`
1. Papel do administrador e aviso Funcionário = Admin; acesso (remete ao cap. 1 do funcionário)
2. Contas de usuários: consultar (e-mail mascarado e "mostrar"), detalhe, excluir conta a pedido do titular (2 etapas, efeitos LGPD)
3. O que o painel **não** faz, por desenho: ver diário/tratamento/mascote, alterar senha ou perfil de terceiros, mudar consentimento por alguém
4. Segurança da própria conta: senha forte, sair em computador compartilhado, novo admin só pela equipe técnica (seed/banco)
5. Em breve: suspender/reativar, gêneros, consentimentos agregados, registro de exclusões · FAQ

---

## FASE 4 — Checklist de execução

1. [ ] **Recuperar os casos de uso:** versionar `docs/casos-de-uso-mobile.md` (stash da `feat/HeuristicasNielsen`) ou usar a cópia do scratchpad.
2. [ ] **Matriz de cobertura mobile:** rota → UC → seção do manual atual; listar lacunas e divergências (seção 8 dos casos de uso).
3. [ ] **Reestruturar:** `git mv docs/manual-de-uso.md docs/manual/mobile.md`; criar `docs/manual/README.md`; atualizar referências. → `♻️ refactor(docs): move manual to docs/manual`
4. [ ] **Completar o mobile** com as lacunas do item 2, no modelo de seção. → `📚 docs(manual): complete mobile manual`
5. [ ] **Prints mobile:** lista de shots do manual no `capture-screens.mjs` (ou em lista separada passada por argumento), saída em `docs/manual/prints/mobile/`. → `📚 docs(manual): add mobile screenshots`
6. [ ] **Manual web-funcionário** (após os itens 6–7 do plano do painel), com passos executados no painel local. → `📚 docs(manual): add web staff manual`
7. [ ] **Manual web-admin** (após o item 8 do plano do painel). → `📚 docs(manual): add web admin manual`
8. [ ] **Prints web:** `apps/web/scripts/capture-screens.mjs` (Playwright, login com o admin do seed), saída em `docs/manual/prints/web/`. → `🔧 chore(web): add screenshot script` + `📚 docs(manual): add web screenshots`
9. [ ] **Revisão:** checar a matriz de cobertura (zero rotas sem seção), a linguagem e os critérios 1–7; registrar o histórico aqui.

Ordem: 1 → 2 → 3 → 4 → 5 podem começar já; 6 → 7 → 8 dependem do painel; 9 por último. Os prints web finais só depois do ajuste do Figma (item 9 do plano do painel), para não refazer.

---

## FASE 5 — Verificação

- [x] Sem regra de negócio envolvida (documentação); comportamento ancorado em código e PRDs
- [x] Sem acoplamento novo (só um script de captura no `apps/web`)
- [x] Critérios de aceite objetivos (7)
- [x] Checklist ≤ 10 itens (9)
- [x] 3 abordagens avaliadas, 1 escolhida (A)
- [x] Evidências ≤ 7 (6)
- [x] Bloqueadoras: nenhuma; dependência do stash explicitada

**Gate = Livre para execução** (itens 1–5 já; 6–8 após as telas do painel)

---

## Histórico de execução

_(vazio)_
