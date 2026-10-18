// Garante que as telas do fluxo-roteiro e os componentes do DS usam apenas tokens
// (sem cor ou tamanho literal). Uso: npx tsx scripts/check-hardcoded.ts
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../src');

/** Telas do fluxo-roteiro da AV2 + componentes que elas usam. */
export const FLOW_FILES = [
  'app/_layout.tsx',
  'app/(Home)/_layout.tsx',
  'app/(Home)/index.tsx',
  'app/(auth)/LoginScreen.tsx',
  'app/(Home)/Oncology/index.tsx',
  'app/(Home)/Oncology/Leisure/index.tsx',
  'app/(Home)/Oncology/Leisure/Books/index.tsx',
  'app/(Home)/Oncology/Leisure/Books/[id].tsx',
  'app/(Home)/MentalHealth/index.tsx',
  'app/(Home)/MentalHealth/PanicButtonContacts/index.tsx',
  'app/(Home)/Mascot/index.tsx',
  'app/(Home)/Mascot/Chat/index.tsx',
  'app/(Home)/PersonalArea/index.tsx',
  'app/(Home)/PersonalArea/Hub/index.tsx',
  'app/(Home)/PersonalArea/Diary/index.tsx',
  'app/(Home)/PersonalArea/Diary/create/index.tsx',
  'app/(Home)/PersonalArea/Diary/update/index.tsx',
  'components/diary',
  'app/design-system.tsx',
  'components/ds',
  'components/auth/AuthGate.tsx',
  'components/auth/LoginForm.tsx',
  'components/home',
  'components/layouts/AuthLayout/AuthLayoutStyle.ts',
  'components/ui/Accordion/AccordionCard.tsx',
  'components/ui/Buttons/ButtonPrimary.tsx',
  'components/ui/Buttons/ButtonOutline.tsx',
  'components/ui/Buttons/Overlay/PanicButton/EmergencyContacts.tsx',
  'components/ui/Images/HorizontalBanner.tsx',
  'components/ui/Navigation',
  'components/ui/Pagers/PagerHeader.tsx',
  'components/ui/Pagers/RecomendationPager.tsx',
  'components/ui/SearchBar/index.tsx',
  'components/ui/ScreenTitle.tsx',
  'components/ui/UserProfile/ProfileRow.tsx',
  'constants/CommonScreenOptions.ts',
  'styles/global.ts',
  'styles/Buttons.ts',
];

const RULES: { name: string; re: RegExp }[] = [
  { name: 'cor hex', re: /['"]#[0-9a-fA-F]{3,8}['"]/ },
  { name: 'cor rgb()', re: /rgba?\(/ },
  { name: 'cor nomeada', re: /color:\s*['"](white|black|red|green|blue|gray|grey)['"]/ },
  { name: 'tamanho literal', re: /\b(fontSize|lineHeight|padding\w*|margin\w*|gap|rowGap|columnGap|borderRadius|border\w*Radius|borderWidth|border\w*Width)\s*:\s*-?\d+(\.\d+)?\b/ },
  { name: 'size={n}', re: /\bsize=\{\d+\}/ },
];

function collect(target: string): string[] {
  const full = path.join(ROOT, target);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [full];
  return fs.readdirSync(full).flatMap((f) => collect(path.join(target, f)));
}

const files = FLOW_FILES.flatMap(collect).filter((f) => /\.(tsx?|ts)$/.test(f));
const violations: string[] = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    for (const rule of RULES) {
      // 0 e 1 (hairline) são permitidos em larguras/margens.
      if (rule.name === 'tamanho literal' && /:\s*-?[01]\b(?!\.)/.test(code) && !/:\s*-?\d{2,}/.test(code)) continue;
      if (rule.re.test(code)) violations.push(`${path.relative(ROOT, file)}:${i + 1}  [${rule.name}]  ${line.trim()}`);
    }
  });
}

console.log(`${files.length} arquivos do fluxo verificados.`);
if (violations.length) {
  console.error(violations.join('\n'));
  console.error(`\n✗ ${violations.length} valor(es) fora dos tokens`);
  process.exit(1);
}
console.log('✓ Nenhuma cor ou tamanho fora dos tokens nas telas do fluxo');
