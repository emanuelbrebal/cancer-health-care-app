# 🧑🏻‍⚕️ Aplicativo OncoMente

> [Aplicativo móvel que tem como foco a democratização de conhecimento acerca da oncologia, bem como saúde mental e combate ao estigma de pessoas com câncer.]
> 

### 💻 Sobre o Projeto

Este projeto surgiu da necessidade de democratizar o conhecimento sobre prevenção e autocuidado em oncologia, além de combater o estigma e os desafios de saúde mental enfrentados por pacientes e seus cuidadores. A ideia principal é fornecer uma interface intuitiva e materiais expositivos, onde o usuário recebe apoio personalizado através de pets virtuais (IA), comunidade no estilo fórum, lembretes de medicação e tratamentos, e mensagens motivacionais, promovendo assim maior esperança e adesão ao tratamento.

### 🛠 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Back-end:** TypeScript, Nest.js.
- **Front-end (Gerenciador):** React. 
- **Aplicativo móvel:** React Native.
- **Banco de Dados:** PostgreSQL, PrismaORM.
- **Outros:** Docker, Docker-compose.

---

### 📱 Requisitos mínimos e dispositivos suportados

A matriz abaixo foi extraída das configurações do projeto (Expo SDK 54, NestJS 11, Vite 7, Prisma 6) e complementada com simulações de build locais quando aplicável (`nest build`, `vite build`, `expo export --platform ios|android`). Referência oficial do SDK: [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/).

#### Aplicativo móvel (`apps/mobile`)

Stack: **Expo SDK ~54.0.22 · React Native 0.81.5 · React 19 · New Architecture ativa**

| Plataforma | Versão mínima do SO | Arquitetura |
|---|---|---|
| **iOS / iPadOS** | 15.1 ou superior | arm64 |
| **Android** | 7.0 (Nougat — API 24) ou superior | arm64-v8a, armeabi-v7a, x86_64 |
| **Web** | Suportado pelo Expo Router via Metro, mas o gerenciador administrativo (`apps/web`) é o destino oficial para navegador. |

**Dispositivos compatíveis:**

- **iPhone:** 6s, 6s Plus, SE (1ª geração) e modelos mais novos — incluindo todas as gerações do SE, linhas 7/8/X/XR/XS/11/12/13/14/15/16.
- **iPad:** iPad Air 2+, iPad mini 4+, iPad 5ª geração+, todos os iPad Pro. O app declara `supportsTablet: true`.
- **iPod touch:** 7ª geração.
- **Android:** qualquer aparelho com Android 7.0+ (cobertura de mercado elevada segundo distribuição Google Play).

**Recursos nativos exigidos pelo app:**

- Notificações push e locais (`expo-notifications`).
- Acesso ao calendário (`expo-calendar`) — usado em lembretes de tratamento.
- Câmera/galeria de fotos (`expo-image-picker`) — usado em perfil/diário.
- Áudio e vídeo (`expo-av`, `expo-video`) — exercícios e meditações.
- Armazenamento seguro (`expo-secure-store`) — token JWT.
- Vibração háptica (`expo-haptics`).
- Discagem telefônica nativa (`Linking.openURL('tel:...')`) — Botão do Pânico (CVV/CAVIDA/SAMU).
- Conexão com a internet — para autenticação, mascote IA e conteúdo dinâmico.

**Especificações recomendadas:**

- Memória RAM: 2 GB (mínimo) / 3 GB+ recomendado.
- Espaço livre: ordem de grandeza ~150 MB para instalação em cenários típicos (bundle Hermes na faixa de poucos MB + assets empacotados). O repositório contém ~50 MB de mídia estática em `apps/mobile/assets`; o tamanho final de download/instalação depende do APK/AAB/IPA e dos splits da loja.

**Build de produção:** o tamanho exibido na Play Store / App Store e o “armazenamento do app” nas configurações do sistema podem diferir (cache, dados). Na Play Store, o AAB com **splits por ABI** reduz o download por dispositivo. Medições precisas: `eas build` ou build nativo local.

Permissões do sistema (notificações, calendário, câmera/galeria etc.) podem ser solicitadas conforme cada fluxo da interface.

#### Gerenciador administrativo web (`apps/web`)

Stack: **React 19 · Vite 7.3 · TypeScript 5.9**

Targets ES2020+ (default do Vite 7), portanto suporta:

| Navegador | Versão mínima |
|---|---|
| Google Chrome | 87+ |
| Mozilla Firefox | 78+ |
| Safari (macOS/iOS) | 14+ |
| Microsoft Edge (Chromium) | 88+ |
| Opera | 73+ |

Build de produção de referência: ~187 KB (≈59 KB gzip) — valores obtidos em build local e podem variar.

#### Backend / API (`apps/backend`)

Stack: **NestJS 11 · Prisma 6.19 · PostgreSQL · Node.js**

Requisitos do servidor:

| Componente | Versão mínima | Recomendado |
|---|---|---|
| **Node.js** | 20.19.x (alinhado ao toolchain Expo SDK 54) | 22 LTS |
| **npm** | 10.x | 10.x ou superior |
| **PostgreSQL** | 13 | 15 (alinhado ao `docker-compose.yml`) |
| **Docker / Docker Compose** | Opcional — apenas para subir o Postgres local | — |
| **RAM** | 512 MB | 1 GB+ |
| **Sistema operacional** | Linux, macOS ou Windows (com Node 20+) | Linux/macOS |

Variáveis de ambiente obrigatórias (ver `apps/backend/.env.example`): `DATABASE_URL`, `JWT_SECRET`, `PORT`. O mascote com IA exige `GROQ_API_KEY`; sem a chave, o endpoint do mascote pode retornar fallback. SMTP é necessário para os fluxos de e-mail.

#### Ambiente de desenvolvimento

Para clonar e rodar o monorepo:

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 20.19+ |
| npm | 10+ |
| Xcode (build iOS nativo) | 16.1+ — apenas em macOS |
| Android Studio + JDK 17 | Hedgehog 2023.1+ — para emulador/Gradle |
| Expo Go (testes rápidos sem build nativo) | Compatível com Expo SDK 54 |

Para Android, use o Android Studio / SDK conforme a [documentação atual do Expo](https://docs.expo.dev/).

#### Resumo da simulação de build

| Alvo | Comando | Resultado |
|---|---|---|
| Backend | `npm run build` (em `apps/backend`) | OK — `dist/` gerada |
| Web admin | `npm run build` (em `apps/web`) | OK — bundle ~187 KB / gzip ~59 KB |
| Mobile iOS | `npx expo export --platform ios` | OK — Hermes bundle ~4.5 MB |
| Mobile Android | `npx expo export --platform android` | OK — Hermes bundle ~4.5 MB |

---

### ✨ Funcionalidades (Use Cases)

- [x]  **Cadastro de Usuário:** O usuário (Paciente e Cuidador) pode se cadastrar e gerenciar seu perfil, incluindo um formulário simples para iniciar e um formulário de onboarding para acessar as áreas: social e pessoal.
- [x]  **Feature Principal:** Navegação fácil em tabs pelo sistema. Navegue entre a homepage, área oncológica, área de saúde mental, área social (fórum) e área pessoal (configurações).
      
- [x]  **Área Oncológica:** Área informativa e expositiva de informações relevantes ao tema de saúde oncológica: Área motivacional, Autocuidados, Recomendações de lazer e Benefícios legais (lei).
- [x]  **Cadastrar recomendações de lazer:** A área oncológica contém recomendações de lazer, que são cadastradas no gerenciador WEB. Todos são CRUDS: Livros, Séries, Filmes e Atividades em casa.
      
- [x]  **Área de Saúde Mental:** Área informativa e expositiva de informações relevantes ao tema de saúde mental, relacionada ao tratamento do câncer.
- [x]  **Botão do Pânico:** Disponível em todas as telas da área de saúde mental, o botão do pânico é disposto acima de todos os elementos e fornece números relevantes à saúde mental (SAMU, CVV, CAVIDA) e discagem automática nativa.

- [x]  **Mascote:** O sistema conta com uma integração a um agente de IA que gera mensagens de apoio baseada na personalidade do Mascote escolhido.
- [x]  **Notificações:** O sistema conta com um sistema de notificações personalizadas e cadastráveis (com os protocolos de tratamento/medicamentos).
- [x]  **Diário Virtual:** O usuário pode cadastrar um diário escolhendo um emote (para definir "como estou me sentindo hoje") e o relato. O sistema guarda em segredo e pode gerar um relatório de emoções baseada em um filtro de tempo.
- [x]  **Cadastro de protocolos e medicamentos:** O usuário pode cadastrar protocolos de sessões de terapias e horários para tomar remédios e receber nas notificações.
- [x]  **Informar canais de denúncia ao usuário:** Área responsável para mostrar canais de denúncia como ouvidorias para combate ao estigma, denúncia de maus-tratos e etc.


### 🧠 O que eu aprendi

Durante o desenvolvimento deste projeto, pude aprimorar meus conhecimentos em:

1. **[Usabilidade]:** Aprendi a pensar melhor em layouts com maior usabilidade e acessibilidade.
2. **[Organização e Componentização]:** Entendi melhor como funciona organização de pastas (incluindo a criação de um MonoRepo), componentizações e reutilização.
3. **[Ecossistema Javascript]:** Este sistema me deu a oportunidade de aprender melhor como funciona o ecossistema Javascript e Typescript, com as tecnologias React Native e Nest.js.
4. **[Integração com IA]:** Também pude aprender como integrar IA em meus projetos afim de tornar a vida das pessoas melhor.
5. **[Consumo e criação de APIs RESTful]**: Este sistema me permitiu aprender melhores práticas e a integrar um aplicativo móvel a um gerenciador WEB, via APIs RESTful.
6. **[Utilização de Design Patterns]**: Strategies, Mappers e Dtos foram bem utilizados. 
7. **[Docker]**: Esse sistema me permitiu aprender a configuração de um arquivo docker-compose e a conteinerização do projeto.
   
---

### 📦 Como rodar o projeto

Este projeto é um monorepo dividido em duas partes principais:
- **Backend:** API (Nest.js)
- **Gerenciador Web** Site fullstack (React)
- **Mobile:** Aplicativo (React Native + Expo)

Você precisará de dois terminais abertos para rodar o ambiente completo.

#### 1️⃣ Rodando a API / Gerenciador Web (NestJS)

```bash
# Entre na pasta do backend
$ cd server  # ou o nome da sua pasta do Nest

# Instale as dependências
$ npm install

# Configure as variáveis de ambiente
$ cp .env.example .env

# Suba o container do banco de dados (se estiver usando Docker)
$ docker-compose up -d

# Rode o servidor em modo de desenvolvimento
$ npm run start:dev
# O servidor iniciará geralmente em http://localhost:3000
```

#### 2️⃣ Rodando o App Mobile (React Native + Expo)
```bash
# Em outro terminal, entre na pasta do mobile
$ cd mobile

# Instale as dependências
$ npm install

# Inicie o bundler do Expo
$ npx expo start
```
