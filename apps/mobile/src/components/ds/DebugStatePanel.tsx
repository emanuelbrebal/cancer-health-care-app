import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, layout, radius, shadow, space, touch, typography } from '@/src/constants/tokens';
import { ForcedState, useUxDebugStore } from '@/src/store/useUxDebugStore';

const OPTIONS: { value: ForcedState; label: string }[] = [
  { value: 'auto', label: 'Real' },
  { value: 'loading', label: 'Carregando' },
  { value: 'success', label: 'Sucesso' },
  { value: 'error', label: 'Erro' },
  { value: 'empty', label: 'Vazio' },
];

/**
 * Painel discreto para forçar estados de interface durante a gravação.
 * Recolhido: um ponto no canto superior esquerdo. Ativado em /design-system.
 */
export function DebugStatePanel() {
  const { panelVisible, forced, setForced, setPanelVisible } = useUxDebugStore();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  if (!panelVisible) return null;

  const current = OPTIONS.find((o) => o.value === forced)?.label;

  return (
    <View pointerEvents="box-none" style={[styles.root, { top: insets.top + space.xxs }]}>
      {open ? (
        <View style={styles.panel}>
          <Text style={styles.caption}>Simular estado das telas com dados</Text>
          <View style={styles.chips}>
            {OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => setForced(o.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: forced === o.value }}
                style={[styles.chip, forced === o.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, forced === o.value && styles.chipTextActive]}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.footer}>
            <Pressable onPress={() => setOpen(false)} style={styles.link} accessibilityRole="button">
              <Text style={styles.linkText}>Recolher</Text>
            </Pressable>
            <Pressable
              onPress={() => { setForced('auto'); setPanelVisible(false); }}
              style={styles.link}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>Desligar painel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Painel de estados: ${current}`}
          style={styles.dotHit}
        >
          <View style={[styles.dot, forced !== 'auto' && styles.dotActive]} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: space.xxs,
    right: space.xxs,
    zIndex: 1000,
    alignItems: 'flex-start',
  },
  dotHit: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: space.xs + space.xxs,
    height: space.xs + space.xxs,
    borderRadius: radius.pill,
    backgroundColor: color.border.strong,
    opacity: 0.6,
  },
  dotActive: {
    backgroundColor: color.border.brand,
    opacity: 1,
  },
  panel: {
    backgroundColor: color.bg.surface,
    borderRadius: radius.lg,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    padding: space.sm,
    gap: space.xs,
    maxWidth: layout.maxContentWidth,
    ...shadow.md,
  },
  caption: {
    ...typography.caption,
    color: color.text.secondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  chip: {
    minHeight: touch.min,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    borderWidth: layout.borderHairline,
    borderColor: color.border.strong,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: color.action.primary,
    borderColor: color.action.primary,
  },
  chipText: {
    ...typography.smallStrong,
    color: color.text.primary,
  },
  chipTextActive: {
    color: color.text.onAction,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    minHeight: touch.min,
    justifyContent: 'center',
  },
  linkText: {
    ...typography.smallStrong,
    color: color.text.link,
  },
});
