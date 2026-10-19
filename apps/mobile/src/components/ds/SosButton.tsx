import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { color, iconSize, layout, radius, shadow, space, touch, typography } from '@/src/constants/tokens';

interface SosButtonProps {
  style?: StyleProp<ViewStyle>;
  /** Apenas para a vitrine do Design System. */
  forcePressed?: boolean;
  /** false = renderiza no fluxo (vitrine), sem posição absoluta. */
  floating?: boolean;
}

/**
 * Atalho de emergência sempre visível nas áreas públicas: 1 toque até CVV, SAMU e CAVIDA.
 * Rótulo textual ("SOS") além do ícone, cor de perigo convencional e alvo de 56 px.
 */
export function SosButton({ style, forcePressed, floating = true }: SosButtonProps) {
  function open() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    router.push('/MentalHealth/PanicButtonContacts');
  }

  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel="SOS: ajuda urgente"
      accessibilityHint="Abre os contatos de emergência: CVV, SAMU e CAVIDA"
      style={({ pressed }) => [
        styles.button,
        floating && styles.floating,
        (forcePressed ?? pressed) && styles.pressed,
        style,
      ]}
    >
      <Feather name="phone-call" size={iconSize.md} color={color.text.onAction} />
      <Text style={styles.label}>SOS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touch.comfortable + space.xs,
    minWidth: touch.comfortable + space.xl,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    backgroundColor: color.action.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    alignSelf: 'flex-start',
    ...shadow.md,
  },
  floating: {
    position: 'absolute',
    right: space.sm,
    bottom: layout.tabBarHeight + space.sm,
  },
  pressed: {
    backgroundColor: color.action.dangerPressed,
    transform: [{ scale: 0.96 }],
  },
  label: {
    ...typography.bodyStrong,
    color: color.text.onAction,
  },
});
