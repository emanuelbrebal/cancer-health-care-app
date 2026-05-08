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

### 📱 Especificações técnicas (aplicativo móvel)

Valores alinhados ao **Expo SDK 54** usado em `apps/mobile` (consulte a [documentação do Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) para atualizações).

| Item | Requisito |
|------|-----------|
| **Android** | 7.0 ou superior |
| **iOS** | 15.1 ou superior |
| **Tablet** | iPad suportado (`supportsTablet` no app) |
| **Rede** | Internet (Wi‑Fi ou dados móveis) para login, API, conteúdo dinâmico e funcionalidades que dependem do backend |
| **Armazenamento** | ~50 MB de mídia estática no repositório; tamanho do download/instalação do app fechado **medido no artefato** (ver nota abaixo). Dados de uso: AsyncStorage (leve) + cache de rede. |
| **RAM / processador** | Não há especificação no código; em geral, aparelhos que atendem às versões de SO acima executam o app. Recursos como vídeo, imagens e WebView tendem a responder melhor em dispositivos mais recentes |

**Build de produção e espaço no aparelho:** o que a loja mostra como “tamanho do app” (download) costuma ser menor que “dados + app” no sistema, que inclui cache. Em `apps/mobile/assets` há imagens, ícones, banners e vídeos locais (exercícios) — isso entra no binário. Somam-se ainda o JavaScript empacotado, Hermes e bibliotecas nativas. O valor exato de APK/AAB/IPA obtém-se após `eas build` ou build local. Na Play Store, o AAB com **splits por ABI** reduz o download por dispositivo.

Permissões do sistema (notificações, calendário, câmera/galeria etc.) podem ser solicitadas conforme cada fluxo da interface.

#### 🔧 Desenvolvimento (referência Expo SDK 54)

| Ferramenta | Versão mínima indicada |
|------------|-------------------------|
| **Node.js** | 20.19.x |
| **Xcode** (build iOS local) | 16.1 ou superior |

Para Android, use o Android Studio / SDK conforme a [documentação atual do Expo](https://docs.expo.dev/).

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
