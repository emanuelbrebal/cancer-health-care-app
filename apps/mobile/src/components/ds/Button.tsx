import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonVisualState = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled' | 'loading';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Apenas para a vitrine do Design System: fixa um estado visual. */
  forceState?: ButtonVisualState;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// bgHover só aparece com ponteiro (web); no toque, o estado é pressed.
const VARIANTS: Record<ButtonVariant, { bg: string; bgHover: string; bgPressed: string; fg: string; border: string }> = {
  primary: { bg: color.action.primary, bgHover: color.action.primaryHover, bgPressed: color.action.primaryPressed, fg: color.text.onAction, border: color.action.primary },
  secondary: { bg: color.bg.surface, bgHover: color.bg.subtle, bgPressed: color.bg.brandSubtle, fg: color.text.link, border: color.text.link },
  ghost: { bg: 'transparent', bgHover: color.bg.subtle, bgPressed: color.bg.brandSubtle, fg: color.text.link, border: 'transparent' },
  danger: { bg: color.action.danger, bgHover: color.action.dangerHover, bgPressed: color.action.dangerPressed, fg: color.text.onAction, border: color.action.danger },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  forceState,
  style,
  testID,
}: ButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant];
  const isLoading = loading || forceState === 'loading';
  const isDisabled = disabled || forceState === 'disabled';
  const inactive = isLoading || isDisabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: isLoading }}
      testID={testID}
      style={({ pressed }) => {
        const isPressed = forceState ? forceState === 'pressed' : pressed;
        const isFocused = forceState ? forceState === 'focus' : focused;
        const isHovered = forceState ? forceState === 'hover' : hovered && !inactive;
        return [
          styles.base,
          fullWidth && styles.fullWidth,
          { backgroundColor: v.bg, borderColor: v.border },
          isHovered && { backgroundColor: v.bgHover },
          isPressed && { backgroundColor: v.bgPressed, transform: [{ scale: 0.98 }] },
          isFocused && styles.focus,
          isDisabled && styles.disabled,
          style,
        ];
      }}
    >
      {isLoading ? (
        <View style={styles.row}>
          <ActivityIndicator color={v.fg} />
          <Text style={[styles.label, { color: v.fg }]}>Aguarde…</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {icon ? <Feather name={icon} size={iconSize.md} color={isDisabled ? color.text.disabled : v.fg} /> : null}
          <Text style={[styles.label, { color: isDisabled ? color.text.disabled : v.fg }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.comfortable,
    minWidth: touch.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: layout.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  label: {
    ...typography.bodyStrong,
  },
  focus: {
    borderColor: color.border.focus,
    borderWidth: layout.focusRing,
  },
  disabled: {
    backgroundColor: color.action.disabledBg,
    borderColor: color.action.disabledBg,
  },
});
