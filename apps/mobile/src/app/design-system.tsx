import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonVariant, ButtonVisualState } from '@/src/components/ds/Button';
import { Card, NavItemCard } from '@/src/components/ds/Card';
import { Header } from '@/src/components/ds/Header';
import { SosButton } from '@/src/components/ds/SosButton';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';
import { TextField } from '@/src/components/ds/TextField';
import { ToastView } from '@/src/components/ds/Toast';
import {
  color, contrastPairs, iconSize, layout, palette, radius, shadow, space, touch, typography,
} from '@/src/constants/tokens';
import { toastService } from '@/src/services/toastService';
import { ForcedState, useUxDebugStore } from '@/src/store/useUxDebugStore';
import { contrastRatio, WCAG_AA_TEXT } from '@/src/utils/contrast';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const STATES: ButtonVisualState[] = ['default', 'pressed', 'focus', 'disabled', 'loading'];
const STATE_LABEL: Record<ButtonVisualState, string> = {
  default: 'Default', pressed: 'Pressed', focus: 'Focus', disabled: 'Disabled', loading: 'Loading',
};
const FORCED: { value: ForcedState; label: string }[] = [
  { value: 'auto', label: 'Real' },
  { value: 'loading', label: 'Carregando' },
  { value: 'success', label: 'Sucesso' },
  { value: 'error', label: 'Erro' },
  { value: 'empty', label: 'Vazio' },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Header title={title} subtitle={subtitle} />
      {children}
    </View>
  );
}

function RatioBadge({ ratio }: { ratio: number }) {
  const ok = ratio >= WCAG_AA_TEXT;
  return (
    <View style={[styles.badge, { backgroundColor: ok ? color.bg.success : color.bg.danger }]}>
      <Text style={[styles.badgeText, { color: ok ? color.text.success : color.text.danger }]}>
        {ratio.toFixed(2)}:1 {ok ? 'AA' : 'falha'}
      </Text>
    </View>
  );
}

export default function DesignSystemScreen() {
  const { panelVisible, setPanelVisible, forced, setForced } = useUxDebugStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(Home)'))}
          accessibilityRole="button"
          accessibilityLabel="Fechar Design System"
          style={styles.closeBtn}
        >
          <Feather name="x" size={iconSize.lg} color={color.text.brand} />
        </Pressable>
        <Text style={styles.topTitle} accessibilityRole="header">Design System OncoMente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Simulação de estados" subtitle="Para gravar: força carregando, erro ou vazio nas telas que buscam dados (Lazer, Livros, Diário, Chat).">
          <Card>
            <View style={styles.switchRow}>
              <Text style={styles.body}>Mostrar painel discreto nas telas</Text>
              <Switch
                value={panelVisible}
                onValueChange={setPanelVisible}
                accessibilityLabel="Mostrar painel de estados"
                trackColor={{ true: color.action.primary, false: color.border.strong }}
              />
            </View>
            <View style={styles.chips}>
              {FORCED.map((f) => (
                <Button
                  key={f.value}
                  title={f.label}
                  variant={forced === f.value ? 'primary' : 'secondary'}
                  onPress={() => setForced(f.value)}
                />
              ))}
            </View>
          </Card>
        </Section>

        <Section title="Cores" subtitle="Paleta base com contraste contra branco e contra o texto principal.">
          <View style={styles.swatchGrid}>
            {Object.entries(palette).map(([name, hex]) => (
              <View key={name} style={styles.swatch}>
                <View style={[styles.swatchColor, { backgroundColor: hex }]} />
                <Text style={styles.caption}>{name}</Text>
                <Text style={styles.mono}>{hex}</Text>
                <Text style={styles.caption}>
                  ⬜ {contrastRatio(hex, palette.neutral0).toFixed(1)} · ⬛ {contrastRatio(hex, palette.neutral900).toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Pares texto/fundo" subtitle={`Todos verificados por scripts/check-contrast.ts (mínimo ${WCAG_AA_TEXT}:1).`}>
          {contrastPairs.map((p) => (
            <View key={p.uso} style={[styles.pair, { backgroundColor: p.bg }]}>
              <Text style={[styles.body, { color: p.fg, flex: 1 }]}>{p.uso}</Text>
              <RatioBadge ratio={contrastRatio(p.fg, p.bg)} />
            </View>
          ))}
        </Section>

        <Section title="Tipografia" subtitle="Montserrat (sem serifa). Corpo mínimo 16; legenda 13.">
          {Object.entries(typography).map(([name, t]) => (
            <View key={name} style={styles.typeRow}>
              <Text style={[t, { color: color.text.primary }]}>Cuidar de você</Text>
              <Text style={styles.mono}>{name} · {t.fontSize}/{t.lineHeight}</Text>
            </View>
          ))}
        </Section>

        <Section title="Espaçamento, raios e sombras" subtitle="Escala de 8 (4 para ajustes finos).">
          {Object.entries(space).map(([name, value]) => (
            <View key={name} style={styles.spaceRow}>
              <Text style={[styles.mono, styles.spaceLabel]}>{name} · {value}</Text>
              <View style={[styles.spaceBar, { width: value * 4 }]} />
            </View>
          ))}
          <View style={styles.radiusRow}>
            {Object.entries(radius).filter(([n]) => n !== 'pill').map(([name, value]) => (
              <View key={name} style={styles.radiusItem}>
                <View style={[styles.radiusBox, { borderRadius: value }]} />
                <Text style={styles.caption}>{name} · {value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.radiusRow}>
            {(['sm', 'md'] as const).map((name) => (
              <View key={name} style={[styles.shadowBox, shadow[name]]}>
                <Text style={styles.caption}>shadow.{name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.body}>Alvo de toque mínimo: {touch.min}×{touch.min} · confortável: {touch.comfortable}</Text>
        </Section>

        <Section title="Button" subtitle="4 variantes × 5 estados. Altura mínima 48.">
          {VARIANTS.map((variant) => (
            <View key={variant} style={styles.buttonBlock}>
              <Text style={styles.label}>{variant}</Text>
              <View style={styles.buttonGrid}>
                {STATES.map((state) => (
                  <View key={state} style={styles.buttonCell}>
                    <Button title={variant === 'danger' ? 'Ligar' : 'Salvar'} variant={variant} forceState={state} />
                    <Text style={styles.caption}>{STATE_LABEL[state]}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Text style={styles.label}>SOS (atalho de emergência)</Text>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonCell}><SosButton floating={false} /><Text style={styles.caption}>Default</Text></View>
            <View style={styles.buttonCell}><SosButton floating={false} forcePressed /><Text style={styles.caption}>Pressed</Text></View>
          </View>
        </Section>

        <Section title="TextField" subtitle="Label sempre visível, erro associado ao campo.">
          <TextField label="E-mail" placeholder="seuemail@exemplo.com" icon="mail" helper="Default com texto de ajuda" />
          <TextField label="E-mail" placeholder="seuemail@exemplo.com" icon="mail" forceFocus helper="Focus" />
          <TextField label="Nome" value="Maria" icon="user" helper="Preenchido" />
          <TextField label="Senha" isPassword value="123" icon="lock" error="A senha deve ter no mínimo 6 caracteres." required />
          <TextField label="Telefone" placeholder="(82) 90000-0000" icon="phone" disabled helper="Disabled" />
        </Section>

        <Section title="Card e Header">
          <Card><Text style={styles.body}>Card estático: superfície branca, raio lg, borda sutil.</Text></Card>
          <NavItemCard title="Sono" subtitle="Rotina e higiene do sono" icon="moon" onPress={() => {}} />
          <NavItemCard title="Sono" subtitle="Pressed" icon="moon" onPress={() => {}} forcePressed />
          <NavItemCard title="Mascote" subtitle="Requer login" icon="message-circle" onPress={() => {}} locked />
          <Header title="Livros recomendados" actionLabel="Ver todos" onAction={() => {}} />
        </Section>

        <Section title="Toast" subtitle="Feedback não bloqueante (toque para ver ao vivo).">
          <ToastView tone="success" text1="Entrada salva no diário" text2="Você registrou 3 dias seguidos." />
          <ToastView tone="error" text1="Não foi possível salvar" text2="Verifique sua conexão." />
          <ToastView tone="info" text1="Lembrete criado" />
          <View style={styles.chips}>
            <Button title="Sucesso" variant="secondary" onPress={() => toastService.success('Tudo certo!')} />
            <Button title="Erro" variant="secondary" onPress={() => toastService.error('Algo deu errado.')} />
          </View>
        </Section>

        <Section title="Estados de interface" subtitle="Carregando (skeleton), vazio e erro com nova tentativa.">
          <Card><LoadingState variant="list" count={2} /></Card>
          <Card><LoadingState variant="rail" count={3} /></Card>
          <Card><EmptyState icon="book-open" title="Nenhuma entrada ainda" message="Que tal contar como foi o seu dia?" actionLabel="Escrever agora" onAction={() => {}} /></Card>
          <ErrorState onRetry={() => toastService.info('Tentando novamente…')} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg.screen,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.xs,
    borderBottomWidth: layout.borderHairline,
    borderBottomColor: color.border.default,
  },
  closeBtn: {
    width: touch.comfortable,
    height: touch.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    ...typography.subtitle,
    color: color.text.brand,
  },
  content: {
    padding: space.sm,
    gap: space.lg,
    paddingBottom: space.xl,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  section: {
    gap: space.sm,
  },
  body: {
    ...typography.body,
    color: color.text.primary,
  },
  label: {
    ...typography.smallStrong,
    color: color.text.secondary,
    textTransform: 'uppercase',
  },
  caption: {
    ...typography.caption,
    color: color.text.secondary,
  },
  mono: {
    ...typography.caption,
    color: color.text.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    minHeight: touch.min,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  swatch: {
    width: '31%',
    gap: space.xxs,
  },
  swatchColor: {
    height: space.xl,
    borderRadius: radius.sm,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
  },
  pair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    padding: space.sm,
    borderRadius: radius.md,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
  },
  badge: {
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.caption,
  },
  typeRow: {
    gap: space.xxs,
    paddingBottom: space.xs,
    borderBottomWidth: layout.borderHairline,
    borderBottomColor: color.border.default,
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  spaceLabel: {
    width: space.xl * 2,
  },
  spaceBar: {
    height: space.sm,
    backgroundColor: color.icon.brand,
    borderRadius: radius.sm,
  },
  radiusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  radiusItem: {
    alignItems: 'center',
    gap: space.xxs,
  },
  radiusBox: {
    width: space.xl,
    height: space.xl,
    backgroundColor: color.bg.brandMuted,
    borderWidth: layout.borderStrong,
    borderColor: color.border.brand,
  },
  shadowBox: {
    flex: 1,
    padding: space.sm,
    borderRadius: radius.lg,
    backgroundColor: color.bg.surface,
  },
  buttonBlock: {
    gap: space.xs,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  buttonCell: {
    alignItems: 'center',
    gap: space.xxs,
  },
});
