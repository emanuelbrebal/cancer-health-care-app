import { NavItemCard } from '@/src/components/ds/Card';
import { CardItem } from '@/src/interfaces/CardItem';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

interface NavigationGridProps {
  data: CardItem[];
  /** Mantido por compatibilidade: a lista agora é sempre de uma coluna. */
  singleElement?: boolean
}

// map simples em vez de FlatList: dentro de container flex:0 ela fica com altura 0 no web.
export default function NavigationGrid({ data }: NavigationGridProps) {
  const router = useRouter();

  return (
    <View accessibilityRole="list">
      {data.map((item, index) => (
        <NavItemCard
          key={String(item.id)}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.featherIcon ?? 'chevron-right'}
          divider={index < data.length - 1}
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
}
