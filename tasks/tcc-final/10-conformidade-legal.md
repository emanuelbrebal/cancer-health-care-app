# 10 — Conformidade Legal (LGPD e legislação aplicável) + Consentimentos por Área

> Substitui/expande: plano 04 item 21 (consentimento no register), plano 02 itens 11 e 13 (checkbox LGPD e modal "Por que coletamos"), plano 09 item 10 (consentimento de analytics — passa a usar a infraestrutura deste plano).
> ⚖️ **Aviso:** este plano define requisitos técnicos e a estrutura dos documentos. Os **textos jurídicos finais** (Política de Privacidade, Termos de Uso, RIPD) devem ser revisados por profissional do Direito ou pelo encarregado de dados da instituição antes da distribuição.

## FASE 1 — Escopo

**Objetivo:** o app e o gerenciador web cumprem a LGPD para **dados pessoais sensíveis de saúde**, as demais leis aplicáveis estão mapeadas para requisitos verificáveis, e cada área que trata dado sensível tem consentimento **específico, destacado, registrado e revogável**.

### Mapa legal → impacto no sistema

| Norma | Dispositivo | O que exige do OncoMente | Onde |
|---|---|---|---|
| **LGPD** — Lei 13.709/2018 | art. 5º II; art. 11 I | Dados de saúde (diário emocional, tratamentos, medicamentos, conversa com o mascote) são **sensíveis** → consentimento "de forma específica e destacada, para finalidades específicas" | Modais por área (abaixo) |
| | art. 8º §2º | Ônus da prova do consentimento é do controlador → registrar no servidor (quem, o quê, versão, quando) | `ConsentRecord` |
| | art. 8º §4º–§5º; art. 9º | Consentimento por finalidade determinada; revogação a qualquer tempo, gratuita e facilitada; informação clara sobre o tratamento | Central de Privacidade |
| | art. 6º | Princípios: finalidade, necessidade (minimização), transparência, segurança, prevenção | Revisão de campos coletados |
| | art. 14 | Crianças: consentimento específico de pelo menos um dos pais/responsável; adolescentes: melhor interesse (o app atende "pacientes de todas as idades") | Fluxo de menor de idade |
| | art. 18 e 19 | Direitos do titular: confirmação, acesso, correção, anonimização, **portabilidade**, eliminação, informação sobre compartilhamento, revogação; resposta completa em até 15 dias | Central de Privacidade + fila no web |
| | art. 33 | **Transferência internacional**: o mascote envia contexto para a Groq (EUA) → base legal + informação ao titular | Modal do mascote |
| | art. 37, 38 | Registro das operações de tratamento (ROPA); Relatório de Impacto (RIPD) — recomendado/exigível para dado sensível | Documentos |
| | art. 41 | Encarregado (DPO) identificado com contato público | Política + app + web |
| | art. 46–49 | Segurança técnica e administrativa; **comunicação de incidente** à ANPD e aos titulares | Plano de resposta a incidentes |
| **Marco Civil da Internet** — Lei 12.965/2014 | art. 7º VI–X | Informações claras nos termos; consentimento expresso e destacado para coleta; exclusão definitiva ao fim da relação | Termos de Uso, cadastro |
| | art. 15 | Guarda de registros de acesso a aplicações por 6 meses | Já tratado (plano 09, D7) |
| **ECA** — Lei 8.069/1990 | — | Proteção integral de criança/adolescente | Fluxo de menor; conteúdo adequado |
| **Lei Brasileira de Inclusão** — Lei 13.146/2015 | art. 63 | Acessibilidade obrigatória em sites/serviços digitais | RNF03 (plano 02 M4, plano 03) |
| **Política Nacional de Prevenção da Automutilação e do Suicídio** — Lei 13.819/2019 | — | Diretriz de acolhimento e encaminhamento → reforça protocolo de emergência do mascote e o botão de emergência (CVV 188, SAMU 192) | Mascote, Saúde Mental |
| **Estatuto da Pessoa com Câncer** — Lei 14.238/2021 | — | Conteúdo de direitos (já citado em `ReportsArea`) | Área legal |
| **Lei dos 60 dias** — Lei 12.732/2012 · **Lei dos 30 dias** — Lei 13.896/2019 (exames para diagnóstico) | — | Conteúdo informativo; a 13.896 não aparece no app hoje | `Oncology/LegalArea` |
| **Direitos autorais** — Lei 9.610/1998 | — | Capas, sinopses e textos de terceiros: usar licença aberta, domínio público ou citação com fonte; registrar origem no cadastro | Campo `source/license` em mídia |
| **CFM** Res. 2.314/2022 (telemedicina) · **CFP** Res. 11/2018 (serviços psicológicos online) | — | O app e o mascote **não** prestam ato médico nem atendimento psicológico → aviso explícito; mascote não diagnostica nem prescreve (já previsto em `mascot/prompt/scope.md`) | Modal do mascote, Termos |
| **Código de Defesa do Consumidor** — Lei 8.078/1990 | art. 6º III | Informação adequada e clara ao usuário (mesmo em serviço gratuito, por cautela) | Termos de Uso |
| **Marco legal de IA** — PL 2.338/2023 | — | Transparência: informar que é IA, limites e supervisão humana. **Confiança: LOW** sobre o status de tramitação em 2026 — verificar antes de citar como lei vigente; aplicar como boa prática | Modal do mascote |
| **Lei 13.787/2018** (prontuário) | — | **Não se aplica**: o app não é prontuário. Declarar isso nos Termos para não gerar expectativa de guarda clínica | Termos |

### Consentimentos e avisos por área

Regras gerais: modal em tela cheia/bottom sheet, título claro, **o que** é coletado, **para quê**, **com quem** é compartilhado, **por quanto tempo**, como revogar; botões "Concordo" e "Agora não" com o mesmo peso visual (sem *dark pattern*); link "Ler política completa"; versão do texto registrada.

| # | Área / gatilho | Tipo | Bloqueia a área se recusar? | Finalidade (`ConsentPurpose`) |
|---|---|---|---|---|
| C1 | Cadastro rápido | Aceite de **Termos de Uso + Política de Privacidade** + declaração de idade | Sim (sem aceite não há conta) | `TERMS`, `PRIVACY_POLICY` |
| C2 | Menor de idade (data de nascimento < 18 ou declaração no cadastro) | Consentimento do responsável: nome + e-mail do responsável, confirmação por e-mail com link | Sim, para áreas com dado sensível (C4–C6) | `GUARDIAN_CONSENT` |
| C3 | Cadastro progressivo (telefone, nascimento, foto) | Consentimento opcional, por campo | Não — campos opcionais | `PROFILE_DATA` |
| C4 | 1º acesso ao **Diário** | Consentimento específico de dado sensível (estado emocional), cifrado, visível só ao titular | Sim (só o diário) | `DIARY_HEALTH_DATA` |
| C5 | 1º acesso a **Tratamentos / Calendário** | Consentimento específico (medicamentos, médico, hospital) | Sim (só essas telas) | `TREATMENT_HEALTH_DATA` |
| C6 | 1º acesso ao **Mascote** | (a) aviso "isto é uma IA, não é profissional de saúde; em emergência ligue 188/192"; (b) consentimento de tratamento por IA e **transferência internacional** (Groq, EUA); (c) opção separada "usar meus tratamentos e diário como contexto" | (a)+(b) sim; (c) não — sem (c) o mascote responde sem contexto pessoal | `AI_PROCESSING`, `AI_INTERNATIONAL_TRANSFER`, `AI_PERSONAL_CONTEXT` |
| C7 | Ativar **notificações** | Pré-permissão explicando o uso (lembretes de medicação) antes do diálogo do SO | Não | — (permissão do SO; registrar escolha) |
| C8 | Foto de perfil (galeria/câmera) | Pré-permissão + texto de uso do SO (iOS `NSPhotoLibraryUsageDescription`/`NSCameraUsageDescription`) | Não | — |
| C9 | **Biometria** | Aviso: a biometria fica no aparelho; o OncoMente não recebe nem armazena | Não | — |
| C10 | **Exportar relatório PDF** do diário | Aviso: "o arquivo sairá do app; compartilhe só com quem confia" | Não (confirmação) | — |
| C11 | **Dados de uso anônimos** (plano 09) | Opt-in desligado por padrão | Não | `USAGE_ANALYTICS` |
| C12 | **Botão de emergência / discagem** | **Nenhum modal bloqueante.** Proteção da vida (LGPD art. 11 II "e") é a base legal; aviso discreto no rodapé da central de contatos sobre o registro da discagem (RF-014) | **Nunca bloqueia** | — |
| C13 | Excluir conta / dados | Confirmação dupla com explicação do que é apagado e do que fica guardado por obrigação legal (Marco Civil, art. 15) | — | — |
| C14 | **Web admin** — 1º login | Termo de confidencialidade e responsabilidade do operador (acesso a dados pessoais; ações auditadas) | Sim | `ADMIN_CONFIDENTIALITY` |
| C15 | Nova versão da Política/Termos | Re-consentimento no próximo acesso, com resumo do que mudou | Sim para C1; outros conforme mudança | mesma finalidade, nova `version` |

**Não-escopo:** certificações (ISO 27701), contratação formal de DPO, cláusulas-padrão contratuais com a Groq (registrar como pendência institucional — ver D9).

**Critérios de aceite**
1. Nenhuma rota que grava ou lê diário, tratamento ou contexto do mascote funciona sem o consentimento correspondente ativo → `403 CONSENT_REQUIRED` com a finalidade faltante (teste e2e por finalidade).
2. Sem `AI_PERSONAL_CONTEXT`, o prompt enviado à Groq não contém tratamento nem histórico emocional (teste unitário do `PromptLoaderService`/`MascotService`).
3. Revogar um consentimento na Central de Privacidade tem efeito imediato no servidor e é registrado (`revokedAt`).
4. `GET /users/me/export` devolve JSON com todos os dados do titular (perfil, diários decifrados, tratamentos, consentimentos, histórico do mascote) — portabilidade (art. 18 V).
5. Solicitações do titular aparecem numa fila no web com prazo de 15 dias e status.
6. Usuário menor de 18 só acessa C4–C6 após confirmação do responsável.
7. A central de emergência abre e disca **sem nenhum modal**, inclusive para usuário sem login e sem consentimento.
8. Política de Privacidade, Termos de Uso e Aviso de IA versionados, editáveis no web e exibidos no app a partir do servidor (com cópia embarcada para uso offline).
9. Modais seguem o checklist de UX (botões com peso igual, linguagem simples, acessíveis por leitor de tela).
10. Documentos ROPA, RIPD e Plano de Resposta a Incidentes publicados em `docs/legal/`.

## FASE 2 — Evidências

| Arquivo | Âncora | Fato |
|---|---|---|
| `apps/backend/src/mascot/mascot.service.ts` | `baseURL: 'https://api.groq.com/openai/v1'` (~32) | Contexto do usuário sai do país sem consentimento nem aviso |
| `apps/backend/src/mascot/prompt-loader.service.ts` | `PromptVariables` (`tratamentos`, `historico_emocional`) | Dados sensíveis injetados no prompt |
| `apps/backend/src/auth/dto/register.dto.ts` | classe inteira | Nenhum campo de aceite/consentimento/idade |
| `apps/mobile/src/app/(Home)/PersonalArea/OnboardingForm/index.tsx` | 51–57 | Galeria sem pré-permissão; `ImagePicker.MediaTypeOptions` deprecado |
| `apps/mobile/app.json` | `plugins` | `expo-image-picker` ausente dos plugins → conferir textos de permissão no iOS |
| `apps/mobile/src/app/(Home)/Oncology/LegalArea/index.tsx` | 45, 58 | Só a Lei 12.732/2012 citada; falta a Lei 13.896/2019 |
| `apps/mobile/src/components/ui/Buttons/Overlay/PanicButton/EmergencyContacts.tsx` | 25 | Discagem direta — manter sem barreiras |

## FASE 3 — Decisões

**Bloco 1 — Arquitetura de consentimento**

| Opção | Conformidade | Blast radius | Manutenção | Prova (art. 8º §2º) |
|---|---|---|---|---|
| A. Aceite único no cadastro ("concordo com tudo") | ❌ viola especificidade (art. 11 I) e finalidade determinada (art. 8º §4º) | baixo | alta simplicidade | parcial |
| B. Consentimento granular por finalidade, registrado no servidor (`ConsentRecord` versionado) + `ConsentGuard` nas rotas + `ConsentGate` no app | ✅ | médio | média | ✅ |
| C. Modais só no app com flag em AsyncStorage | ⚠️ UX igual a B, mas sem enforcement no servidor | baixo | baixa | ❌ |

**Escolha: B.** É a única que atende especificidade, revogabilidade e ônus da prova. O enforcement no servidor segue a mesma regra do plano 04: a autorização vale no backend, e o app só apresenta.

**Bloco 2 — Textos legais**
Escolha: tabela `LegalDocument { type (PRIVACY_POLICY|TERMS|AI_NOTICE|ADMIN_TERM), version, contentMd, summaryOfChanges, publishedAt, publishedBy }`, editada no web e auditada no `AuditLog`. O app busca a versão vigente e embarca uma cópia para uso offline. Publicar uma nova versão dispara o re-consentimento (C15). Descartado: textos hardcoded no app, porque qualquer ajuste jurídico exigiria novo build.

**Bloco 3 — Menores de idade**
Escolha: declaração de idade no cadastro (data de nascimento obrigatória **apenas** para essa verificação, com a finalidade explicada). Se < 18: pedir e-mail do responsável e enviar link de confirmação (token de 7 dias). Até confirmar, a conta funciona só nas áreas públicas e de conteúdo. Postura conservadora: o art. 14 exige consentimento parental para crianças (< 12) e eu apliquei o mesmo a adolescentes. **Confiança: MEDIUM** sobre a obrigatoriedade para 12–17 anos, já que a ANPD admite outras bases legais no melhor interesse do adolescente; validar com o orientador.

## FASE 4 — Checklist de execução

**L1 — Backend** · branch `feat/backend-consent-management` (após plano 04 B1)
1. [ ] Models `ConsentRecord { id, userId, purpose, version, granted, grantedAt, revokedAt?, appVersion, ipHash? }`, `LegalDocument`, `DataSubjectRequest { id, userId, type (ACCESS|EXPORT|CORRECTION|DELETION|REVOCATION|INFO), status, dueAt (= +15 dias), resolvedAt, resolvedBy, notes }`, `GuardianConsent { userId, guardianName, guardianEmail, tokenHash, confirmedAt? }`; `User.birthday` passa a ser coletado no cadastro; migration — `✨ feat(prisma): add consent and legal tables`
2. [ ] Módulo `consent`: `GET /consents/me`, `POST /consents` (grant), `DELETE /consents/:purpose` (revoke); `ConsentGuard` + decorator `@RequiresConsent(...)` aplicado em daily-logs, treatments, ai-support; erro `403 { code: 'CONSENT_REQUIRED', purpose }` — `✨ feat(auth): enforce purpose consent`
3. [ ] Register: `acceptedTermsVersion`, `acceptedPrivacyVersion`, `birthday` obrigatórios; menor → cria `GuardianConsent` e envia e-mail; `POST /guardian-consent/confirm` — `✨ feat(auth): add terms acceptance and guardian flow`
4. [ ] Mascote: montar o prompt **sem** tratamento/histórico quando não houver `AI_PERSONAL_CONTEXT`; recusar com 403 sem `AI_PROCESSING`/`AI_INTERNATIONAL_TRANSFER`; minimizar o contexto enviado (só o necessário: primeiro nome, dias de tratamento, emoções agregadas da semana — nunca o texto do diário) — `🐛 fix(mascot): respect personal context consent`
5. [ ] Módulo `legal`: CRUD admin de `LegalDocument` (versionamento imutável — publicar cria nova versão), `GET /legal/:type/current` público — `✨ feat(backend): add legal documents module`
6. [ ] Direitos do titular: `GET /users/me/export` (JSON), `POST /privacy-requests`, endpoints admin da fila com SLA; exclusão LGPD integrada ao plano 04 item 20 e à retenção do plano 09 — `✨ feat(user): add data subject rights`
7. [ ] Mídia: campos `source` e `license` (direitos autorais) em `Media`/`LeisureActivity` — `✨ feat(media): track content source and license`
8. [ ] Testes e2e: matriz finalidade × rota (403/200), revogação imediata, prompt sem contexto, menor sem responsável, export completo — `🧪 test(backend): cover consent enforcement`

**L2 — Mobile** · branch `feat/mobile-consent-privacy` (após L1 itens 1–2)
9. [ ] Componentes `ConsentModal` (props: purpose, título, itens "o quê/para quê/com quem/por quanto tempo", links) e `ConsentGate` (envolve a rota; consulta `/consents/me` com cache; trata `CONSENT_REQUIRED` vindo do interceptor do Axios) — `✨ feat(components): add consent modal and gate`
10. [ ] Aplicar C1 (cadastro: aceite + data de nascimento + responsável), C3, C4 (Diário), C5 (Tratamentos/Calendário), C6 (Mascote: 3 etapas), C10 (PDF), C13 (exclusão) — 1 commit por área — `✨ feat(auth): require terms acceptance` · `✨ feat(personal-area): gate diary behind consent` · `✨ feat(mascot): add ai notice and consent` …
11. [ ] Pré-permissões C7/C8/C9: tela explicativa antes de `requestPermissionsAsync` (notificações, galeria/câmera, biometria); adicionar o plugin `expo-image-picker` ao `app.json` com `photosPermission`/`cameraPermission` em pt-BR; trocar `MediaTypeOptions.Images` por `mediaTypes: ['images']` — `🐛 fix(mobile): add permission rationale and ios strings`
12. [ ] **Central de Privacidade** em Configurações: lista de consentimentos com toggles (revogar/conceder), "Baixar meus dados" (export + compartilhar), "Solicitar correção/exclusão", política e termos vigentes, contato do encarregado. Também substitui o modal "Por que coletamos esses dados?" do RF-019, que passa a abrir a Central — `✨ feat(personal-area): add privacy center`
13. [ ] Re-consentimento C15 no boot quando a versão vigente ≠ aceita; conteúdo: Lei 13.896/2019 na `LegalArea`; aviso de registro de discagem (C12, não bloqueante) — `✨ feat(auth): prompt re-consent on policy update` · `✨ feat(oncology): add 30-day exam law`

**L3 — Web** · branch `feat/web-legal-compliance` (após plano 03 itens 1–4)
14. [ ] C14 termo do operador no 1º login (registra `ADMIN_CONFIDENTIALITY`); páginas: Documentos legais (editor Markdown + preview + "publicar nova versão" com resumo de mudanças), Solicitações de titulares (fila com prazo, alerta < 3 dias), indicadores de consentimento no dashboard (taxa de aceite por finalidade, revogações/mês — agregado) — `✨ feat(web): add legal documents and privacy requests`

**L4 — Documentos** · branch `docs/legal-compliance`
15. [ ] `docs/legal/politica-de-privacidade.md` (controlador, encarregado, dados por finalidade, bases legais — consentimento art. 11 I para dados de saúde, proteção da vida art. 11 II "e" para a emergência, obrigação legal para os logs do Marco Civil —, compartilhamento: Groq/EUA, provedor de hospedagem, SMTP; retenção da tabela D7; direitos e como exercer; menores; segurança; incidentes; alterações)
16. [ ] `docs/legal/termos-de-uso.md` (natureza informativa e de apoio; **não substitui atendimento médico/psicológico**; IA e seus limites; conduta; propriedade intelectual; responsabilidades; foro)
17. [ ] `docs/legal/aviso-ia.md`, `docs/legal/ropa.md` (registro de operações: cada tratamento, finalidade, base legal, dados, compartilhamento, retenção, medidas de segurança), `docs/legal/ripd.md` (relatório de impacto: riscos × medidas, reaproveitando RS001–RS005), `docs/legal/resposta-a-incidentes.md` (detecção via plano 09, contenção, avaliação, comunicação à ANPD e aos titulares, registro)
18. [ ] Integrar nos entregáveis: relatório de diferenças (plano 06), manual de uso (plano 07: seção de privacidade com prints de cada modal), manual de instalação (plano 08: variáveis e responsabilidades da instituição como controladora) — `📚 docs(legal): add privacy and compliance documents`

## FASE 5 — Verificação

- [x] Consentimento validado no servidor (`ConsentGuard`); o app só apresenta
- [x] Emergência nunca condicionada a consentimento (C12, critério 7)
- [x] Minimização aplicada ao contexto do mascote (L1 item 4)
- [x] Critérios testáveis (matriz e2e, export, menor, prompt)
- [x] 3 abordagens avaliadas, B escolhida
- [x] Evidências ≤ 7
- [ ] 18 itens (> 10): divididos em 4 blocos independentes, cada um com ≤ 8
- [x] Pendências explicitadas:

| # | Decisão | Default | Responsável |
|---|---|---|---|
| D9 | Quem é o **controlador** e o **encarregado** (instituição × autores do TCC) | Instituição como controladora após a entrega; na banca, os autores constam como operadores | Orientador/instituição |
| D10 | Base para transferência internacional (Groq) | Consentimento específico (art. 33 VIII) + aviso; avaliar cláusulas-padrão (Res. CD/ANPD nº 19/2024) se a instituição assumir o serviço. Alternativa futura: provedor de LLM com servidores no Brasil | Instituição |
| D11 | Consentimento parental para 12–17 anos | Exigir (postura conservadora) | Orientador |

**Gate = Livre para execução** do L1 após o plano 04 B1. Os textos jurídicos ficam condicionados à revisão por profissional (aviso no topo).
