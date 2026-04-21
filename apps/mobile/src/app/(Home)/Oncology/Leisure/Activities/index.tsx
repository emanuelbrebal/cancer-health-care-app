import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import leisureService, { LeisureActivity } from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import SearchBar from '@/src/components/ui/SearchBar';

const TYPE_LABEL: Record<string, string> = {
  THERAPY:      'Terapêutica',
  RECREATIONAL: 'Recreativa',
  CULTURAL:     'Cultural',
  PHYSICAL:     'Física',
  SOCIAL:       'Social',
};

export default function ActivitiesListScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [activities, setActivities] = useState<LeisureActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    leisureService.getActivities()
      .then(setActivities)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar as atividades.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (item: LeisureActivity) => {
    router.push({
      pathname: '/Oncology/Leisure/Activities/[id]',
      params: {
        id: item.id,
        name: item.name,
        imagePath: item.imagePath ?? '',
        type: (item as any).type ?? '',
        frequency: (item as any).frequency ?? '',
      },
    });
  };

  if (loading) {
    return (
      <View style={[globalStyles.startContainer, { paddingTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.purplePrimary} />
      </View>
    );
  }

  const filtered = query.trim()
    ? activities.filter((a) => {
        const q = query.toLowerCase();
        const typeLabel = TYPE_LABEL[(a as any).type ?? ''] ?? '';
        return a.name.toLowerCase().includes(q) || typeLabel.toLowerCase().includes(q);
      })
    : activities;

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nome ou tipo..." />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma atividade disponível no momento.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.8}>
            <Image source={getMediaImage(item.imagePath)} style={styles.image} resizeMode="cover" />
            <View style={styles.cardText}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              {!!(item as any).type && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{TYPE_LABEL[(item as any).type] ?? (item as any).type}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  image: { width: '100%', height: 140 },
  cardText: { padding: 10 },
  name: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: Colors.purplePrimary + '18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Montserrat',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.purplePrimary,
  },
  empty: {
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginTop: 60,
    color: Colors.text.secondary,
  },
});
