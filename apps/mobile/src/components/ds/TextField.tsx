import { Feather } from '@expo/vector-icons';
import { forwardRef, useId, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Rótulo sempre visível acima do campo (não depende do placeholder). */
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  disabled?: boolean;
  /** Apenas para a vitrine do Design System. */
  forceFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, helper, required, icon, isPassword, disabled, forceFocus, containerStyle, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const labelId = useId();
  const isFocused = forceFocus ?? focused;
  const multiline = !!rest.multiline;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text nativeID={labelId} style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          isFocused && styles.fieldFocus,
          !!error && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}
      >
        {icon ? (
          <Feather name={icon} size={iconSize.md} color={error ? color.text.danger : color.icon.muted} />
        ) : null}
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={color.text.secondary}
          secureTextEntry={isPassword && !visible}
          editable={!disabled}
          accessibilityLabel={label}
          accessibilityLabelledBy={labelId}
          accessibilityHint={error ?? helper}
          accessibilityState={{ disabled }}
          aria-invalid={!!error}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={space.xs}
            style={styles.eye}
          >
            <Feather name={visible ? 'eye-off' : 'eye'} size={iconSize.md} color={color.icon.muted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Feather name="alert-circle" size={iconSize.sm} color={color.text.danger} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: space.xs,
    alignSelf: 'stretch',
  },
  label: {
    ...typography.smallStrong,
    color: color.text.primary,
  },
  required: {
    color: color.text.danger,
  },
  field: {
    minHeight: touch.comfortable,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
    borderWidth: layout.borderHairline,
    borderColor: color.border.strong,
    borderRadius: radius.md,
    backgroundColor: color.bg.surface,
  },
  fieldMultiline: {
    minHeight: touch.comfortable * 3,
    alignItems: 'flex-start',
    paddingVertical: space.xs,
  },
  fieldFocus: {
    borderColor: color.border.focus,
    borderWidth: layout.borderStrong,
  },
  fieldError: {
    borderColor: color.border.danger,
    borderWidth: layout.borderStrong,
  },
  fieldDisabled: {
    backgroundColor: color.bg.subtle,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    ...typography.body,
    color: color.text.primary,
    outlineStyle: 'none',
  } as any,
  eye: {
    width: touch.min,
    height: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  error: {
    ...typography.small,
    color: color.text.danger,
    flexShrink: 1,
  },
  helper: {
    ...typography.small,
    color: color.text.secondary,
  },
});
