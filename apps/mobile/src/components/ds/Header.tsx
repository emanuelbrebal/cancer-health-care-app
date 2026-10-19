import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, iconSize, space, touch, typography } from '@/src/constants/tokens';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap;
  /** Nível semântico: 'screen' para o título da tela, 'section' para blocos internos. */
  level?: 'screen' | 'section';
  actionLabel?: string;
  onAction?: () => void;
}

/** Cabeçalho de tela ou de seção, com ação opcional à direita ("Ver todos"). */
export function Header({ title, subtitle, icon, level = 'section', actionLabel, onAction }: HeaderProps) {
  const isScreen = level === 'screen';
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon ? <Feather name={icon} size={isScreen ? iconSize.lg : iconSize.md} color={color.icon.brand} /> : null}
        <Text accessibilityRole="header" style={[isScreen ? styles.screenTitle : styles.sectionTitle]}>
          {title}
        </Text>
        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            accessibilityRole="link"
            accessibilityLabel={`${actionLabel}: ${title}`}
            hitSlop={space.xs}
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Feather name="chevron-right" size={iconSize.sm} color={color.text.link} />
          </Pressable>
        ) : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  screenTitle: {
    ...typography.title,
    color: color.text.brand,
    flex: 1,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: color.text.primary,
    flex: 1,
  },
  subtitle: {
    ...typography.small,
    color: color.text.secondary,
  },
  action: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    paddingHorizontal: space.xs,
  },
  actionPressed: {
    opacity: 0.6,
  },
  actionText: {
    ...typography.smallStrong,
    color: color.text.link,
  },
});
