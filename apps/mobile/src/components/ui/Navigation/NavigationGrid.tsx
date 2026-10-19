import { NavItemCard } from '@/src/components/ds/Card';
import { space } from '@/src/constants/tokens';
import { CardItem } from '@/src/interfaces/CardItem';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

interface NavigationGridProps {
  data: CardItem[];
  /** Mantido por compatibilidade: a lista agora é sempre de uma coluna. */
  singleElement?: boolean
}

// v1 usava FlatList (scrollEnabled=false) dentro de container flex:0; no web a lista
// ficava com altura 0 e os cartões sumiam (P02). Lista curta → map simples.
export default function NavigationGrid({ data }: NavigationGridProps) {
  const router = useRouter();

  return (
    <View style={styles.list} accessibilityRole="list">
      {data.map((item) => (
        <NavItemCard
          key={String(item.id)}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.featherIcon ?? 'chevron-right'}
          locked={item.locked}
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: space.xs,
  },
});
