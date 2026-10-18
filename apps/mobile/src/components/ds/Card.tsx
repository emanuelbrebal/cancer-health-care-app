import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, iconSize, layout, radius, shadow, space, touch, typography } from '@/src/constants/tokens';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  /** Apenas para a vitrine do Design System. */
  forcePressed?: boolean;
}

/** Superfície base: branca, borda sutil, raio lg. Vira botão quando recebe onPress. */
export function Card({ children, onPress, accessibilityLabel, accessibilityHint, style, forcePressed }: CardProps) {
  if (!onPress) {
    return <View style={[styles.card, style]}>{children}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.card, styles.pressable, (forcePressed ?? pressed) && styles.pressed, style]}
    >
      {children}
    </Pressable>
  );
}

interface NavItemCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  /** Mostra um cadeado quando o destino exige login. */
  locked?: boolean;
  forcePressed?: boolean;
}

/** Cartão de navegação: ícone + título + subtítulo + chevron. Alvo de toque ≥ 64 px. */
export function NavItemCard({ title, subtitle, icon, onPress, locked, forcePressed }: NavItemCardProps) {
  return (
    <Card
      onPress={onPress}
      forcePressed={forcePressed}
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      accessibilityHint={locked ? 'Requer login' : 'Abre a seção'}
      style={styles.navCard}
    >
      <View style={styles.iconBox}>
        <Feather name={icon} size={iconSize.lg} color={color.icon.brand} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Feather name={locked ? 'lock' : 'chevron-right'} size={iconSize.md} color={color.icon.muted} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.bg.surface,
    borderRadius: radius.lg,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    padding: space.sm,
    ...shadow.sm,
  },
  pressable: {
    minHeight: touch.min,
  },
  pressed: {
    backgroundColor: color.bg.brandSubtle,
    borderColor: color.border.brand,
    transform: [{ scale: 0.99 }],
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: touch.comfortable + space.sm,
  },
  iconBox: {
    width: touch.comfortable,
    height: touch.comfortable,
    borderRadius: radius.md,
    backgroundColor: color.bg.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    gap: space.xxs,
  },
  title: {
    ...typography.bodyStrong,
    color: color.text.primary,
  },
  subtitle: {
    ...typography.small,
    color: color.text.secondary,
  },
});
