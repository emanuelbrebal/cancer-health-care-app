# 🧑🏻‍⚕️ Aplicativo OncoMente

> [Aplicativo móvel que tem como foco a democratização de conhecimento acerca da oncologia, bem como saúde mental e combate ao estigma de pessoas com câncer.]
> 

### 💻 Sobre o Projeto

Este projeto surgiu da necessidade de democratizar o conhecimento sobre prevenção e autocuidado em oncologia, além de combater o estigma e os desafios de saúde mental enfrentados por pacientes e seus cuidadores. A ideia principal é fornecer uma interface intuitiva e materiais expositivos, onde o usuário recebe apoio personalizado através de pets virtuais (IA), comunidade no estilo fórum, lembretes de medicação e tratamentos, e mensagens motivacionais, promovendo assim maior esperança e adesão ao tratamento.

### 🛠 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Back-end:** TypeScript, Nest.js (Gerenciador)
- **Front-end:** React Native, React (Gerenciador)
- **Banco de Dados:** PostgreSQL.
- **Outros:** [Docker, AWS, etc]

---

### ✨ Funcionalidades (Use Cases)

- [x]  **Cadastro de Usuário:** O usuário (Paciente e Cuidador) pode se cadastrar e gerenciar seu perfil, incluindo um formulário simples para iniciar e um formulário de onboarding para acessar as áreas: social e pessoal.
- [x]  **Feature Principal:** Navegação fácil em tabs pelo sistema. Navegue entre a homepage, área oncológica, área de saúde mental, área social (fórum) e área pessoal (configurações).
      
- [x]  **Área Oncológica:** Área informativa e expositiva de informações relevantes ao tema de saúde oncológica: Área motivacional, Autocuidados, Recomendações de lazer e Benefícios legais (lei).
- [ ]  **Cadastrar recomendações de lazer:** A área oncológica contém recomendações de lazer, que são cadastradas no gerenciador WEB. Todos são CRUDS: Livros, Séries, Filmes e Atividades em casa.
      
- [x]  **Área de Saúde Mental:** Área informativa e expositiva de informações relevantes ao tema de saúde mental, relacionada ao tratamento do câncer.
- [x]  **Botão do Pânico:** Disponível em todas as telas da área de saúde mental, o botão do pânico é disposto acima de todos os elementos e fornece números relevantes à saúde mental (SAMU, CVV, CAVIDA) e discagem automática nativa.
    
- [x]  **Área social (fórum):** Área responsável por reunir Comunidades, Tópicos, Publicações e Conversas.
- [ ]  **Cadastrar Comunidades, Tópicos, Publicações e Conversas:** CRUDS feitos por usuários.

- [x]  **Área social (fórum):** Área responsável por reunir Comunidades, Tópicos, Publicações e Conversas.
- [ ]  **Mascote:** O sistema conta com uma integração a um agente de IA que gera mensagens de apoio baseada na personalidade do Mascote escolhido.
- [ ]  **Notificações:** O sistema conta com um sistema de notificações personalizadas e cadastráveis (com os protocolos de tratamento/medicamentos).
- [ ]  **Diário Virtual:** O usuário pode cadastrar um diário escolhendo um emote (para definir "como estou me sentindo hoje") e o relato. O sistema guarda em segredo e pode gerar um relatório de emoções baseada em um filtro de tempo.
- [ ]  **Cadastro de protocolos e medicamentos:** O usuário pode cadastrar protocolos de sessões de terapias e horários para tomar remédios e receber nas notificações.
- [ ]  **Informar canais de denúncia ao usuário:** Área responsável para mostrar canais de denúncia como ouvidorias para combate ao estigma, denúncia de maus-tratos e etc.


### 🧠 O que eu aprendi

Durante o desenvolvimento deste projeto, pude aprimorar meus conhecimentos em:

1. **[Usabilidade]:** Aprendi a pensar melhor em layouts com maior usabilidade e acessibilidade.
2. **[Organização e Componentização]:** Entendi melhor como funciona organização de pastas, componentizações e reutilização.
3. **[Ecossistema Javascript]:** Este sistema me deu a oportunidade de aprender melhor como funciona o ecossistema Javascript e Typescript, com as tecnologias React Native e Nest.js.
4. **[Integração com IA]:** Também pude aprender como integrar IA em meus projetos afim de tornar a vida das pessoas melhor.
5. **[Consumo e criação de APIs RESTful]**: Este sistema me 

---

### 🚀 O que pode ser melhorado

- [ ]  Melhorar a cobertura de testes unitários.
- [ ]  Implementar Dark Mode.
- [ ]  Otimizar as queries do banco de dados para relatórios grandes.
- [ ]  Moderação da comunidade por administradores.

---

### 📦 Como rodar o projeto

```bash
# Clone o repositório
$ git clone [<https://github.com/seu-usuario/nome-do-projeto.git>](<https://github.com/seu-usuario/nome-do-projeto.git>)

# Acesse a pasta do projeto
$ cd nome-do-projeto

# Instale as dependências (Exemplo para Laravel/Node)
$ npm install

# Configure o arquivo .env
$cp .env.example .env$ php artisan key:generate

# Rode as migrações
$ php artisan migrate

# Inicie o servidor
$ npx expo start

```
