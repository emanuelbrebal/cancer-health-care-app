import { color, layout, radius, shadow, space, typography } from '@/src/constants/tokens';
import { CardItem } from '@/src/interfaces/CardItem';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface NavigationGridProps {
  data: CardItem[];
}

// Grade 2×2 do Início. Renderizada com flexWrap (sem FlatList aninhada — ver P02).
export default function HomeNavigationGrid({ data }: NavigationGridProps) {
  const router = useRouter();

  return (
    <View style={styles.grid} accessibilityRole="list">
      {data.map((item) => (
        <Pressable
          key={String(item.id)}
          onPress={() => router.push(item.route)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconContainer}>
            {item.icon ? <Image source={item.icon} style={styles.icon} resizeMode="contain" /> : null}
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  card: {
    width: '48%',
    minHeight: layout.mascotMd + space.md,
    backgroundColor: color.bg.surface,
    borderRadius: radius.xl,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xs,
    gap: space.xs,
    ...shadow.sm,
  },
  cardPressed: {
    backgroundColor: color.bg.brandSubtle,
    borderColor: color.border.brand,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: layout.mascotSm,
    height: layout.mascotSm,
    borderRadius: radius.lg,
    backgroundColor: color.bg.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: layout.mascotSm,
    height: layout.mascotSm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  cardText: {
    ...typography.bodyStrong,
    color: color.text.primary,
    textAlign: 'center',
  },
});
