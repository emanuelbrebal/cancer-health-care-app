# PRD 01 — Acesso e Sessão do Administrador

## Objetivo

Permitir que apenas administradores entrem no painel, mantenham a sessão durante o trabalho e saiam de forma que o acesso seja encerrado no servidor.

## Usuário e cenário

Administrador abre o painel no navegador de um computador, possivelmente compartilhado. Precisa entrar rápido, trabalhar sem ser deslogado no meio de um cadastro e ter certeza de que saiu.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| W01-1 | Tela de login com e-mail e senha. |
| W01-2 | Só entra quem tem `role = ADMIN`. Outras roles recebem "Acesso restrito a administradores" e a sessão recém-criada é encerrada (`POST /auth/logout`). |
| W01-3 | Credenciais inválidas: mensagem única "E-mail ou senha incorretos" (não revela qual está errado). |
| W01-4 | Todas as rotas do painel, exceto login e recuperação de senha, exigem sessão válida; sem sessão, redireciona ao login e volta à página pedida depois de entrar. |
| W01-5 | Renovação silenciosa: ao receber `401`, o painel chama `POST /auth/refresh` uma única vez (requisições simultâneas aguardam a mesma renovação) e repete a requisição original. Se a renovação falhar, vai ao login. |
| W01-6 | "Sair" chama `POST /auth/logout`, limpa o estado local e volta ao login. |
| W01-7 | Recuperação de senha por e-mail (`POST /auth/forgot-password` → link → `POST /auth/reset-password`). A resposta é sempre a mesma, exista ou não o e-mail. |
| W01-8 | Troca de senha logado (`PATCH /auth/change-password`). Depois de trocar, as outras sessões são encerradas. |
| W01-9 | Limite de tentativas: ao receber `429`, mostrar "Muitas tentativas. Aguarde um minuto." |
| W01-10 | Conta suspensa: `403 ACCOUNT_SUSPENDED` mostra "Conta suspensa", sem opção de reativar pelo painel. |

## Endpoints consumidos

| Método | Rota | Estado | Observação |
|---|---|---|---|
| POST | `/auth/login` | Existe | Devolve `access_token` e `user`; passará a devolver também `refresh_token` |
| POST | `/auth/refresh` | **A criar** (item 4) | Rotaciona o refresh a cada uso |
| POST | `/auth/logout` | **A criar** (item 4) | Revoga o refresh no servidor |
| POST | `/auth/forgot-password` | Existe | Limite: 3 por minuto |
| POST | `/auth/reset-password` | Existe | Token de 15 minutos |
| PATCH | `/auth/change-password` | Existe | Exige sessão |

## Regras de sessão

- Access token de curta duração (15 min), mantido **só em memória**.
- Refresh token: janela deslizante de 7 dias, igual ao app.
- **Decisão pendente — onde guardar o refresh no navegador.** Recomendação: cookie `HttpOnly; Secure; SameSite=Strict` emitido pelo backend apenas para o painel, o que exige `credentials` no CORS e proteção CSRF na rota de refresh. Alternativa mais simples e mais fraca: `sessionStorage` (some ao fechar a aba, exposto a XSS). Não usar `localStorage`.
- Inatividade: sugerido encerrar a sessão do painel após 30 minutos sem interação, por ser computador de trabalho.

## Critérios de aceite

1. Usuário `PATIENT` com senha correta não vê nenhuma tela interna.
2. Acessar uma URL interna sem sessão leva ao login e retorna à URL após entrar.
3. Com o access token expirado, uma ação do usuário é concluída sem novo login e gera uma única chamada a `/auth/refresh`.
4. Após "Sair", o refresh antigo devolve `401` se reutilizado.
5. Nenhum token aparece em `localStorage`, na URL ou em logs do console.
6. Formulário de login operável só por teclado, com rótulos e erro anunciado por leitor de tela.

## Fora do escopo

Cadastro de novos administradores pelo painel (feito por seed/banco nesta versão), autenticação em dois fatores, login social.
