-- Migration retroativa: o model UserDeletionLog entrou no schema (commit a4ae244) sem SQL
-- correspondente, e a migration 20261116020000_account_lifecycle já altera esta tabela.
-- Em banco novo o deploy falhava; em bancos que já têm a tabela, IF NOT EXISTS torna isto um no-op.
-- Formato original (com email e name); a account_lifecycle remove essas colunas em seguida.
CREATE TABLE IF NOT EXISTS "user_deletion_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT,
    "reason" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_deletion_logs_pkey" PRIMARY KEY ("id")
);
