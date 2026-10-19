// Verifica pela fórmula WCAG todos os pares texto/fundo registrados em src/constants/tokens.ts.
// Uso: npx tsx scripts/check-contrast.ts [--v1]   (--v1 mostra os pares da versão anterior, sem falhar)
import { contrastPairs } from '../src/constants/tokens';
import { contrastRatio, WCAG_AA_TEXT } from '../src/utils/contrast';

// Pares usados na v1 (commit de baseline), para a tabela "antes" da documentação.
const V1_PAIRS = [
  { fg: '#FFFFFF', bg: '#9B5DE0', uso: 'Botão primário / FAB (v1)' },
  { fg: '#9B5DE0', bg: '#FFFFFF', uso: 'Links, "Sobre", "Cadastre-se" (v1)' },
  { fg: '#FFFFFF', bg: '#FFFFFF', uso: 'Seta voltar no cartão branco (v1)' },
  { fg: '#FFFFFF', bg: '#F2F2F2', uso: 'Logo/título do Início no web (v1)' },
  { fg: '#AAAAAA', bg: '#FFFFFF', uso: '"Continuar sem login" (v1)' },
  { fg: '#888888', bg: '#FFFFFF', uso: '"Limpar conversa" no chat (v1)' },
  { fg: '#999999', bg: '#FFFFFF', uso: 'Placeholder do SoftLoginModal (v1)' },
  { fg: '#B15CCE', bg: '#FFFFFF', uso: 'Rótulo de aba inativa (v1)' },
  { fg: '#0088FF', bg: '#E6FFF9', uso: 'Título "Mensagem do Dia" (v1)' },
  { fg: '#2980B9', bg: '#F0F6FC', uso: 'Card "Tratamentos" no Hub (v1)' },
  { fg: '#1E9951', bg: '#F0F7F2', uso: 'Card "Calendário" no Hub (v1)' },
  { fg: '#8257E5', bg: '#F5F0FA', uso: 'Card "Diário" no Hub (v1)' },
  { fg: '#777777', bg: '#FAFAFA', uso: '"Configurações da Conta" no Hub (v1)' },
  { fg: '#4E56C0', bg: '#FFFFFF', uso: 'Títulos em purpleSecondary (v1)' },
  { fg: '#1A1A1A', bg: '#FFFFFF', uso: 'Texto principal (v1)' },
];

const legacy = process.argv.includes('--v1');
const pairs = legacy ? V1_PAIRS : contrastPairs;

const rows = pairs.map((p) => {
  const ratio = contrastRatio(p.fg, p.bg);
  return { ...p, ratio, ok: ratio >= WCAG_AA_TEXT };
});

const pad = (s: string, n: number) => s.padEnd(n);
console.log(`${pad('Uso', 44)} ${pad('Texto', 8)} ${pad('Fundo', 8)} Razão   AA`);
for (const r of rows) {
  console.log(`${pad(r.uso, 44)} ${pad(r.fg, 8)} ${pad(r.bg, 8)} ${r.ratio.toFixed(2).padStart(5)}:1 ${r.ok ? 'ok' : 'FALHA'}`);
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows.map(({ uso, fg, bg, ratio, ok }) => ({ uso, fg, bg, ratio: +ratio.toFixed(2), ok }))));
}

const failures = rows.filter((r) => !r.ok);
if (legacy) {
  console.log(`\n${failures.length} de ${rows.length} pares da v1 abaixo de ${WCAG_AA_TEXT}:1`);
} else if (failures.length) {
  console.error(`\n✗ ${failures.length} par(es) abaixo de ${WCAG_AA_TEXT}:1`);
  process.exit(1);
} else {
  console.log(`\n✓ ${rows.length} pares ≥ ${WCAG_AA_TEXT}:1`);
}
