import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, DimensionValue, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { color, iconSize, motion, radius, space, typography } from '@/src/constants/tokens';
import { Button } from './Button';

/* ─── Skeleton (carregando) ──────────────────────────────────────────────── */

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = space.sm, rounded = radius.sm, style }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: motion.pulse, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: motion.pulse, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: rounded, backgroundColor: color.bg.brandMuted, opacity }, style]}
    />
  );
}

/** Placeholder de lista/grade enquanto os dados carregam. Anuncia "Carregando" para leitores de tela. */
export function LoadingState({ variant = 'list', count = 3, label = 'Carregando conteúdo' }: {
  variant?: 'list' | 'grid' | 'rail';
  count?: number;
  label?: string;
}) {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility?.(label);
  }, [label]);

  const items = Array.from({ length: count });
  return (
    <View accessible accessibilityLabel={label} accessibilityRole="progressbar" style={styles.loading}>
      {variant === 'list' && items.map((_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <Skeleton width={space.xl} height={space.xl} rounded={radius.md} />
          <View style={styles.skeletonText}>
            <Skeleton width="70%" />
            <Skeleton width="45%" />
          </View>
        </View>
      ))}
      {variant === 'grid' && (
        <View style={styles.skeletonGrid}>
          {items.map((_, i) => <Skeleton key={i} width="47%" height={space.xl * 4} rounded={radius.lg} />)}
        </View>
      )}
      {variant === 'rail' && (
        <View style={styles.skeletonRail}>
          {items.map((_, i) => <Skeleton key={i} width="30%" height={space.xl * 3} rounded={radius.md} />)}
        </View>
      )}
    </View>
  );
}

/* ─── EmptyState (vazio) ─────────────────────────────────────────────────── */

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: keyof typeof Feather.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, icon = 'inbox', actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.state} accessibilityRole="summary">
      <View style={[styles.iconCircle, { backgroundColor: color.bg.brandSubtle }]}>
        <Feather name={icon} size={iconSize.xl} color={color.icon.brand} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} icon="plus" /> : null}
    </View>
  );
}

/* ─── ErrorState (erro) ──────────────────────────────────────────────────── */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão com a internet e tente de novo.',
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorStateProps) {
  return (
    <View style={[styles.state, styles.errorBox]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <View style={[styles.iconCircle, { backgroundColor: color.bg.surface }]}>
        <Feather name="wifi-off" size={iconSize.xl} color={color.text.danger} />
      </View>
      <Text style={[styles.title, { color: color.text.danger }]}>{title}</Text>
      <Text style={[styles.message, { color: color.text.danger }]}>{message}</Text>
      {onRetry ? <Button title={retryLabel} onPress={onRetry} icon="refresh-cw" variant="secondary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    gap: space.sm,
    paddingVertical: space.xs,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  skeletonText: {
    flex: 1,
    gap: space.xs,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space.sm,
  },
  skeletonRail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  state: {
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.lg,
    paddingHorizontal: space.md,
  },
  errorBox: {
    backgroundColor: color.bg.danger,
    borderRadius: radius.lg,
  },
  iconCircle: {
    width: space.xl + space.sm,
    height: space.xl + space.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.subtitle,
    color: color.text.primary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: color.text.secondary,
    textAlign: 'center',
  },
});
