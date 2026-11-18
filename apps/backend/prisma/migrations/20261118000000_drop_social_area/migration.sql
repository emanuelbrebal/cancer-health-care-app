-- Área Social removida do produto e do schema sem migration correspondente.
-- Bancos criados do zero ainda recebiam estas tabelas (vazias e sem uso).
-- IF EXISTS: no-op em bancos onde elas já foram removidas.
-- Ordem: dependentes primeiro (Comment -> Post -> Topic -> Community).
DROP TABLE IF EXISTS "Comment";
DROP TABLE IF EXISTS "Post";
DROP TABLE IF EXISTS "Topic";
DROP TABLE IF EXISTS "Community";
