import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import leisureService, { Series } from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import SearchBar from '@/src/components/ui/SearchBar';

export default function SeriesListScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    leisureService.getSeries()
      .then(setSeries)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar as séries.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (item: Series) => {
    router.push({
      pathname: '/Oncology/Leisure/Series/[id]',
      params: {
        id: item.id,
        title: item.title,
        showrunner: item.showrunner ?? '',
        seasons: String(item.seasons ?? ''),
        episodes: String(item.episodes ?? ''),
        imagePath: item.imagePath ?? '',
        genre: item.genre ?? '',
        whereToFind: JSON.stringify(item.whereToFind ?? []),
        externalLink: item.externalLink ?? '',
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
    ? series.filter((s) => {
        const q = query.toLowerCase();
        return s.title.toLowerCase().includes(q) || (s.showrunner ?? '').toLowerCase().includes(q);
      })
    : series;

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      <FlatList
        data={filtered}
        ListHeaderComponent={
          <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por título ou criador..." />
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma série disponível no momento.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.8}>
            <Image source={getMediaImage(item.imagePath)} style={styles.poster} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              {!!item.showrunner && <Text style={styles.meta}>{item.showrunner}</Text>}
              {!!item.seasons && (
                <Text style={styles.meta}>{item.seasons} temporada{Number(item.seasons) !== 1 ? 's' : ''}</Text>
              )}
              {!!item.genre && <Text style={styles.genre}>{item.genre}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  poster: { width: 80, height: 120 },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  meta: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  genre: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    color: Colors.purplePrimary,
    fontWeight: '600',
    marginTop: 4,
  },
  empty: {
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginTop: 60,
    color: Colors.text.secondary,
  },
});
