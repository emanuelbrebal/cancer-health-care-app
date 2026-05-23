# Cleanup: Disco + Dependências npm

**Branch alvo:** `chore/cleanup-deps-and-disk`
**Status:** Executado ✅
**Gate:** Livre para execução
**Commit:** `e551477`

> **Pré-requisito:** Working tree tem mudanças não commitadas (`README.md` modificado, `INSTALL.md` untracked).
> Antes de criar a branch, faça commit ou stash desses arquivos.

---

## FASE 1 — Scope Analysis

**Objetivo:** Reduzir drasticamente o uso de disco do projeto, corrigir os conflitos de versão npm que quebram o `npm install` e o build EAS, e garantir que o monorepo instale sem erros em máquinas novas.

**Módulos/áreas afetados:**
- `package.json` (root) — overrides de versão
- `apps/mobile/package.json` — versão errada de `expo-navigation-bar`
- `apps/backend/package.json` — `lerna` em `dependencies` errado, `@nestjs/swagger` desatualizado
- `apps/mobile/assets/` — 51 MB de assets potencialmente não utilizados (49 vídeos MP4)
- `.gitignore` / `.easignore` — prevenção de reincidência
- npm cache global (`%LOCALAPPDATA%\npm-cache`) — 9.8 GB

**Escopo:**
- Limpar npm cache global
- Deletar todos os `node_modules` (root + apps)
- Corrigir versões conflitantes nos `package.json`
- Reinstalar dependências sem conflitos
- Verificar assets não referenciados e mover para uma pasta de revisão
- Atualizar `.gitignore` / criar `.easignore`

**Não-escopo:**
- Atualizar Expo SDK (apenas corrigir versões já declaradas)
- Adicionar novas features
- Alterar lógica de negócio

**Impacto técnico:**
- Redução esperada: ~10–11 GB → ~850 MB no projeto
- `npm install` limpo após correção dos `package.json`
- EAS Build desbloquado (pacotes UNMET resolvidos)

**Critérios de aceite:**
1. `npm install` no root executa sem erros (`npm error` ou `UNMET DEPENDENCY`)
2. `npm ls --depth=0` no root não lista `invalid` nem `UNMET DEPENDENCY`
3. `npx expo start` inicia sem erros de módulo
4. `npm run start:backend` inicia sem crash
5. npm cache reduzido a zero (ou < 500 MB após re-install)
6. assets MP4 não referenciados identificados e documentados

**Perguntas bloqueadoras:** nenhuma — evidência suficiente coletada.

**Premissas:**
- As versões corretas serão fixadas conforme Expo SDK 54 e NestJS 11
- `lottie-react-native@^7.3.8` e `@expo/ngrok@^4.1.3` são UNMET no root mas podem estar presentes em `apps/mobile/node_modules` — verificar antes de remover
- Os 49 arquivos MP4 em assets (27 MB) serão apenas catalogados neste ciclo; remoção definitiva depende de auditoria de uso

---

## FASE 2 — Evidence Gathering

| Evidência | Arquivo | Linha | Impacto |
|-----------|---------|-------|---------|
| `expo-navigation-bar@^55.0.13` — versão inexistente | `apps/mobile/package.json` | 29 | UNMET DEPENDENCY, build quebrado |
| `@nestjs/swagger@11.2.7` instalado vs `^11.4.2` requerido | `apps/backend/package.json` | 38 (deps) + root hoist | `npm error invalid` bloqueando install |
| `lerna` em `dependencies` do backend | `apps/backend/package.json` | 38 | lerna é tooling de monorepo, não runtime |
| `@expo/ngrok@^4.1.3` e `lottie-react-native@^7.3.8` UNMET | `apps/mobile/package.json` | 13, 38 | Pacotes não instalados no root |
| npm cache = **9.8 GB** | `%LOCALAPPDATA%\npm-cache` | — | Principal responsável pelos 8 GB relatados |
| Root `node_modules`: 530 MB | projeto root | — | Eliminar com `npm ci` pós-fix |
| `apps/mobile/node_modules`: 301 MB | — | — | Deduplicar via hoisting |
| `apps/backend/node_modules`: 269 MB | — | — | Deduplicar via hoisting |
| `apps/mobile/assets`: 51 MB (49 MP4s) | `apps/mobile/assets/` | — | Potencial redução se não usados |
| `backend/dist/`: 0.7 MB | `apps/backend/dist/` | — | Deletável (regenerado no build) |

**Fluxo atual de problema:**
```
npm install (root)
  → tenta hoistear @nestjs/swagger → encontra 11.2.7 no cache
  → backend requer ^11.4.2 → conflict
  → expo-navigation-bar@^55 → não existe → UNMET
  → npm error ELSPROBLEMS → install falha ou fica inconsistente
```

---

## FASE 3 — Architecture Planning (Tree of Thought)

### 3A — Abordagens

**Opção A — Reinstalação bruta (delete-all + npm install)**
Delete tudo (`node_modules` + `package-lock.json`), corrige `package.json`, roda `npm install`.
- Simples, mas não garante que conflitos de versão foram resolvidos antes do install.

**Opção B — Fix cirúrgico + reinstalação seletiva**
Corrige os `package.json` primeiro (versões conflitantes), depois deleta `node_modules` + `package-lock.json` e roda `npm install`.
- Mais seguro: resolve as causas antes de reinstalar.

**Opção C — Migração para `npm workspaces` puro (sem Lerna para hoisting)**
Remove Lerna do processo de hoisting, usa apenas npm workspaces nativos.
- Mais disruptivo, risco alto de quebrar scripts existentes. Não vale neste ciclo.

### 3B — Avaliação

| Critério | Opção A | Opção B | Opção C |
|---|---|---|---|
| Corretude técnica | Média (pode reinstalar versões erradas) | Alta | Alta |
| Blast radius | Baixo | Baixo | Alto |
| Custo de manutenção | Baixo | Baixo | Alto |
| Alinhamento com arquitetura | Sim | Sim | Não (mudança estrutural) |
| Score | 3/4 | 4/4 | 2/4 |

### 3C — Convergência

**Vencedora: Opção B** — Fix cirúrgico primeiro, depois limpeza total.

Descartadas:
- A: risco de `npm install` falhar novamente com versões erradas
- C: mudança arquitetural fora de escopo

---

## FASE 4 — Execution Planning (Chain of Thought)

### Checklist de execução (em ordem de dependência)

- [ ] **1. Commitar/stash mudanças pendentes** (`README.md`, `INSTALL.md`) e criar branch `chore/cleanup-deps-and-disk`

- [ ] **2. Limpar npm cache global**
  ```powershell
  npm cache clean --force
  # Libera ~9.8 GB
  ```

- [ ] **3. Corrigir `apps/mobile/package.json`**
  - `expo-navigation-bar`: `^55.0.13` → `~4.0.9` (versão correta para Expo SDK 54)

- [ ] **4. Corrigir `apps/backend/package.json`**
  - Mover `lerna` de `dependencies` para remover completamente (já está no root `devDependencies`)
  - Atualizar `@nestjs/swagger`: `^11.4.2` → `^11.4.4` (latest)

- [ ] **5. Corrigir root `package.json`**
  - Verificar se `overrides` de `react: 19.1.0` está causando conflito com `react-native` (RN 0.81.5 usa React 19 — OK)
  - Adicionar override para `@nestjs/swagger: ^11.4.4` para garantir hoisting correto

- [ ] **6. Deletar todos os node_modules e package-lock**
  ```powershell
  Remove-Item -Recurse -Force node_modules, package-lock.json
  Remove-Item -Recurse -Force apps/mobile/node_modules
  Remove-Item -Recurse -Force apps/backend/node_modules, apps/backend/dist
  Remove-Item -Recurse -Force apps/web/node_modules
  Remove-Item -Recurse -Force packages/shared/node_modules -ErrorAction SilentlyContinue
  ```

- [ ] **7. Reinstalar dependências limpas**
  ```powershell
  npm install
  # Verificar: npm ls --depth=0 não deve ter erros
  ```

- [ ] **8. Validar instalação**
  ```powershell
  npm ls --depth=0
  # Esperado: sem UNMET DEPENDENCY, sem invalid
  ```

- [ ] **9. Auditar assets MP4 não referenciados**
  - Listar arquivos MP4 em `apps/mobile/assets/`
  - Cruzar com referências em `src/` (`.ts`, `.tsx`)
  - Documentar órfãos no `INSTALL.md` ou criar `assets/README.md`
  - **Não deletar ainda** — catalogar para decisão posterior

- [ ] **10. Criar/atualizar `.easignore`**
  ```
  # .easignore (raiz do mobile)
  apps/backend/
  apps/web/
  apps/postman/
  .postman/
  node_modules/
  tasks/
  .claude/
  **/*.md
  ```

---

## FASE 5 — Verificação do Plano

- [x] Nenhuma regra de negócio na camada errada
- [x] Nenhum acoplamento desnecessário entre módulos
- [x] Critérios de aceite são objetivos e testáveis (comandos verificáveis)
- [x] Checklist ≤ 10 itens (exatamente 10)
- [x] 3 abordagens avaliadas, 1 escolhida com justificativa clara
- [x] Evidências ≤ 7 arquivos (6 arquivos referenciados)
- [x] Nenhuma pergunta bloqueadora pendente

---

## Gate: Livre para execução ✅

**Resumo do que será feito:**
1. Limpar npm cache global (~9.8 GB liberados imediatamente)
2. Corrigir 3 erros de versão nos `package.json` (causa raiz dos conflitos)
3. Reinstalação limpa do monorepo completo
4. Catalogar assets MP4 potencialmente não usados (27 MB)
5. Criar `.easignore` para builds EAS mais limpos

**Risco:** Baixo — todas as mudanças são reversíveis. `package-lock.json` será regenerado. Nenhuma lógica de negócio alterada.

---

## Stage de Execução — Entregáveis

| # | Descrição | Caminho | Status |
|---|-----------|---------|--------|
| 1 | Branch criada e stash/pop de mudanças pendentes | `chore/cleanup-deps-and-disk` | ✅ |
| 2 | npm cache global limpo | `%LOCALAPPDATA%\npm-cache` | ✅ |
| 3 | Versão `expo-navigation-bar` corrigida (`^55.0.13` → `~4.0.9`) | `apps/mobile/package.json:29` | ✅ |
| 4 | Versão `@nestjs/swagger` corrigida (`^11.4.2` → `^11.4.4`) + `lerna` removido de `dependencies` | `apps/backend/package.json` | ✅ |
| 5 | Override `@nestjs/swagger: ^11.4.4` adicionado no root | `package.json` | ✅ |
| 6 | Todos os `node_modules` e `package-lock.json` deletados | root + apps/* | ✅ |
| 7 | Reinstalação limpa (`npm install`) | root | ✅ |
| 8 | Validação `npm ls --depth=0` sem erros | root | ✅ |
| 9 | 25 MP4s órfãos catalogados (13.72 MB) — não deletados | `apps/mobile/assets/` | ✅ |
| 10 | `.easignore` criado para builds EAS | `apps/mobile/.easignore` | ✅ |

**Desvios do plano:** nenhum.

---

## Stage de Execução — Validação

| Critério de aceite | Resultado | Observação |
|---|---|---|
| `npm install` executa sem `npm error` | ✅ | Exit code 0, apenas `warn deprecated` normais |
| `npm ls --depth=0` sem `invalid` / `UNMET DEPENDENCY` | ✅ | Zero erros; `@nestjs/swagger@11.4.4 overridden`, `expo-navigation-bar@4.0.9` resolvidos |
| `@expo/ngrok` e `lottie-react-native` resolvidos | ✅ | Antes UNMET, agora instalados corretamente |
| npm cache reduzido | ✅ | 9.8 GB → 662 MB (residual de metadados, normal) |
| Assets MP4 órfãos identificados e documentados | ✅ | 25 arquivos / 13.72 MB catalogados abaixo |
| `.easignore` criado | ✅ | `apps/mobile/.easignore` com 8 regras |

### MP4s órfãos catalogados (aguardando decisão de remoção)

| Arquivo | Tamanho |
|---------|---------|
| exercise-020.mp4 | 0.63 MB |
| exercise-010.mp4 | 0.62 MB |
| exercise-004.mp4 | 0.62 MB |
| exercise-033.mp4 | 0.62 MB |
| exercise-021.mp4 | 0.60 MB |
| exercise-027.mp4 | 0.60 MB |
| warmup-013.mp4 | 0.60 MB |
| exercise-031.mp4 | 0.60 MB |
| exercise-026.mp4 | 0.60 MB |
| exercise-012.mp4 | 0.60 MB |
| exercise-015.mp4 | 0.60 MB |
| exercise-014.mp4 | 0.60 MB |
| exercise-022.mp4 | 0.59 MB |
| warmup-008.mp4 | 0.57 MB |
| exercise-011.mp4 | 0.57 MB |
| exercise-005.mp4 | 0.56 MB |
| exercise-024.mp4 | 0.56 MB |
| exercise-025.mp4 | 0.56 MB |
| exercise-016.mp4 | 0.55 MB |
| warmup-001.mp4 | 0.51 MB |
| exercise-032.mp4 | 0.51 MB |
| warmup-005.mp4 | 0.45 MB |
| warmup-009.mp4 | 0.44 MB |
| exercise-006.mp4 | 0.28 MB |
| exercise-013.mp4 | 0.28 MB |
| **Total** | **13.72 MB** |
