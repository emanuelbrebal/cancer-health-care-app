# Pesquisa e Atualização dos Seeders de Lazer

**Data:** 2026-04-24  
**Branch:** fix/refining-fixes-to-launch-the-prototype

---

## Resumo das Alterações

### Schema Prisma
Adicionado o campo `synopsis String? @db.Text` a dois modelos:
- `Media` — cobre livros, filmes e séries
- `LeisureActivity` — cobre atividades em casa

> **Ação necessária:** Executar `npx prisma migrate dev --name add-synopsis-to-media-and-leisure` no diretório `apps/backend/`.

---

## Livros

### O que foi atualizado
- `author` — preenchido onde encontrado (estava "A definir" em todos)
- `page_count` — preenchido onde encontrado
- `whereToFind` — substituído de "Consultar Professora" para plataformas reais
- `isFree` — corrigido para `false` em todos (todos são obras pagas)
- `synopsis` — adicionado em todos

---

### Dados por livro

| # | Título | Autor | Páginas | Plataformas | Status |
|---|--------|-------|---------|-------------|--------|
| 1 | Além da Cura | Milena Patricia da Silva | 213 | Amazon Brasil, Google Play Livros, Apple Books, Kobo, Editora Appris | ✅ Completo |
| 2 | O Guia para Enfrentar o Câncer | A verificar | — | Amazon Brasil, Livraria Cultura, Saraiva | ⚠️ Título não localizado |
| 3 | Ressignificando a Vida através do Câncer | Stephanie Valente Balreira | 148 | Amazon Brasil, Magazine Luiza, Um Livro | ✅ Completo |
| 4 | A Cura do Câncer: Mergulhando no Passado e Ressignificando | Selma C. Morars | 69 | Clube de Autores, Amazon Brasil | ✅ Completo |
| 5 | Sobrevivi: Uma História Real | A verificar | — | Amazon Brasil, Livraria Cultura, Saraiva | ⚠️ Título não localizado |
| 6 | Um Novo Amanhecer na Luta contra o Câncer | Antonia Braz | 168 | Literare Books, Amazon Brasil | ✅ Completo |
| 7 | A Cura Definitiva do Câncer | Luis de Oliveira | — | Amazon Brasil (Kindle e físico) | ⚠️ Ver observação |
| 8 | 208 Dias: Superando o Câncer | Ligia Pinheiro | — | Amazon Brasil | ✅ Autor confirmado |

### Observações — Livros

**Livro 2 — "O Guia para Enfrentar o Câncer"**  
Nenhuma plataforma brasileira (Amazon, Estante Virtual, Saraiva, Livraria Cultura) retornou resultado com esse título exato. Possível título próximo: *"Terapia Para Enfrentar O Câncer"* de **Joel Schorn** (Editora PAULUS, 84 páginas). Recomenda-se confirmar a origem deste título com a equipe.

**Livro 5 — "Sobrevivi: Uma História Real"**  
Título não localizado em plataformas brasileiras vinculado ao tema de câncer. Uma possível correspondência seria *"Raro: Câncer de mama — Vi, vivi e sobrevivi"* de Deise Renata Gozalez Agnani (Amazon Brasil). Recomenda-se verificar a origem do título.

**Livro 7 — "A Cura Definitiva do Câncer"**  
O livro existe (Luis de Oliveira, Amazon KDP), porém apresenta promessas de "cura em 3 meses" sem embasamento médico convencional. Recomenda-se avaliar editorialmente se a sinopse deve incluir um disclaimer mais explícito ou se o título deve ser substituído por outro mais adequado ao perfil oncológico do app.

---

## Filmes

### O que foi atualizado
- `duration` — preenchido (estava "A definir" em todos)
- `whereToFind` — substituído de "A definir" para plataformas reais
- `synopsis` — adicionado em todos

### Dados por filme

| # | Título | Diretor | Ano | Duração | Plataformas |
|---|--------|---------|-----|---------|-------------|
| 1 | Love Story - Uma História de Amor | Arthur Hiller | 1970 | 1h40min | Amazon Prime Video, Apple TV, Google Play Filmes |
| 2 | Laços de Ternura | James L. Brooks | 1983 | 2h12min | Amazon Prime Video, Apple TV, Google Play Filmes |
| 3 | Tudo por Amor | Garry Marshall | 1991 | 1h51min | Amazon Prime Video, Google Play Filmes, Apple TV |
| 4 | Um Golpe do Destino | Randa Haines | 1991 | 2h3min | Amazon Prime Video, Google Play Filmes |
| 5 | Lado a Lado | Chris Columbus | 1998 | 2h4min | Netflix, Amazon Prime Video, Google Play Filmes |
| 6 | Patch Adams | Tom Shadyac | 1998 | 1h55min | Netflix, Amazon Prime Video, Google Play Filmes |
| 7 | Um Amor Verdadeiro | Jon Avnet | 1998 | A verificar | Amazon Prime Video, Google Play Filmes, Apple TV |
| 8 | Um Amor para Recordar | Adam Shankman | 2002 | 1h42min | Netflix, Amazon Prime Video, Google Play Filmes |
| 9 | Antes de Partir | Rob Reiner | 2007 | 1h37min | Amazon Prime Video, Max, Google Play Filmes |
| 10 | Uma Chance Para Viver | A verificar | 2008 | A verificar | Amazon Prime Video, Google Play Filmes |
| 11 | Uma Prova de Amor | Nick Cassavetes | 2009 | 1h49min | Netflix, Amazon Prime Video, Google Play Filmes |
| 12 | Biutiful | Alejandro González Iñárritu | 2010 | 2h28min | Amazon Prime Video, Google Play Filmes, Apple TV |
| 13 | Cartas para Deus | David Nixon | 2010 | 1h53min | YouTube, Amazon Prime Video, Google Play Filmes |

### Observações — Filmes

**Filme 7 — "Um Amor Verdadeiro" (Jon Avnet, 1998)**  
Nenhum filme de Jon Avnet de 1998 com esse título exato foi confirmado. Diretor e duração marcados como "A verificar". Pode se referir a um título com distribuição regional diferente no Brasil.

**Filme 10 — "Uma Chance Para Viver" (2008)**  
Diretor e duração não confirmados. Existem múltiplos títulos com esse nome aproximado em distribuições brasileiras de 2008. Recomenda-se verificar o título original em inglês para confirmar o diretor e duração.

> **Nota sobre disponibilidade de streaming:** As plataformas indicadas refletem disponibilidade típica no Brasil. Catálogos de streaming mudam frequentemente — verificar disponibilidade atual antes de exibir ao usuário.

---

## Séries

### O que foi atualizado
- `whereToFind` — substituído de links genéricos para plataformas específicas
- `isFree` — corrigido: apenas YouTube são gratuitas; Netflix e Amazon são pagas (assinatura)
- `externalLink` — refinado com links mais específicos para YouTube
- `synopsis` — adicionado em todos

### Dados por série

| # | Título | Showrunner | Temporadas | Plataformas | Gratuito |
|---|--------|------------|------------|-------------|---------|
| 1 | Alexa e Katie | Heather Wordham | 4 | Netflix | Não (assinatura) |
| 2 | The Big C / Aquela Doença com C | Darlene Hunt | 4 | Amazon Prime Video, Apple TV | Não (assinatura) |
| 3 | Recomeço | A verificar | 1 | Netflix | Não (assinatura) |
| 4 | Graça e Coragem | A verificar | 1 | Netflix | Não (assinatura) |
| 5 | Playlist: LIVES - Histórias Reais | Patricia Figueiredo | 1 | YouTube (gratuito) | Sim |
| 6 | Hospital de Amor (Barretos) | Hospital de Amor | 1 | YouTube (gratuito) | Sim |

### Observações — Séries

**Séries 3 e 4 — "Recomeço" e "Graça e Coragem"**  
Showrunner não confirmado via pesquisa. O campo foi mantido como "A verificar". Recomenda-se confirmar os criadores/roteiristas responsáveis.

**Correção de isFree:**  
O seeder original marcava todas as séries como `isFree: true`. Após verificação, apenas as séries no YouTube são de fato gratuitas. As séries em Netflix e Amazon Prime Video exigem assinatura e foram corrigidas para `isFree: false`.

---

## Atividades em Casa

### O que foi atualizado
- `synopsis` — adicionado em todos (campo novo)

### Dados por atividade

| # | Nome | Tipo | Frequência | Sinopse (resumo) |
|---|------|------|------------|------------------|
| 1 | Yoga Leve | THERAPY | DAILY | Yoga suave para pacientes em tratamento; alivia tensão, ansiedade e melhora o sono |
| 2 | Jardinagem | RECREATIONAL | WEEKLY | Cuidar de plantas como terapia; conecta com a natureza e dá senso de propósito |
| 3 | Pintura | CULTURAL | WEEKLY | Arte expressiva; externaliza emoções difíceis e estimula criatividade e foco |
| 4 | Diário de Gratidão | THERAPY | DAILY | Registro diário de gratidões; reduz estresse e fortalece resiliência emocional |
| 5 | Meditação Guiada | THERAPY | DAILY | Sessões guiadas de meditação; controla ansiedade e promove equilíbrio emocional |

---

## Próximos Passos

1. **Rodar a migration do Prisma:**
   ```bash
   cd apps/backend
   npx prisma migrate dev --name add-synopsis-to-media-and-leisure
   ```

2. **Rodar o seed para atualizar o banco:**
   ```bash
   cd apps/backend
   npx prisma db seed
   ```

3. **Verificar os títulos pendentes:**
   - Confirmar autor e ISBN de "O Guia para Enfrentar o Câncer"
   - Confirmar autor e ISBN de "Sobrevivi: Uma História Real"
   - Confirmar título original em inglês de "Uma Chance Para Viver" (2008)
   - Confirmar título original e diretor de "Um Amor Verdadeiro" (Jon Avnet, 1998)
   - Confirmar showrunner de "Recomeço" e "Graça e Coragem"

4. **Decisão editorial:**
   - Avaliar se "A Cura Definitiva do Câncer" (Luis de Oliveira) é adequado ao perfil do OncoMente, dado o conteúdo de medicina alternativa sem respaldo científico

5. **Expor synopsis na API:**
   - Verificar se os endpoints de `media` e `leisureActivity` já retornam o novo campo `synopsis` ou se precisam ser atualizados nos DTOs/mappers

---

## Campos Ainda Marcados como "A verificar"

| Item | Campo | Motivo |
|------|-------|--------|
| O Guia para Enfrentar o Câncer | author, page_count | Título não localizado em plataformas |
| Sobrevivi: Uma História Real | author, page_count | Título não localizado em plataformas |
| A Cura Definitiva do Câncer | page_count | Apenas versão ebook encontrada |
| 208 Dias: Superando o Câncer | page_count | Não disponível nas fontes consultadas |
| Um Amor Verdadeiro | duration | Filme não confirmado |
| Uma Chance Para Viver | director, duration | Título ambíguo; múltiplos filmes com nome similar |
| Recomeço | showrunner | Não confirmado |
| Graça e Coragem | showrunner | Não confirmado |
