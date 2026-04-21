import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import leisureService, { Book } from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import SearchBar from '@/src/components/ui/SearchBar';

export default function BooksListScreen() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    leisureService.getBooks()
      .then(setBooks)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os livros.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (item: Book) => {
    router.push({
      pathname: '/Oncology/Leisure/Books/[id]',
      params: {
        id: item.id,
        title: item.title,
        author: item.author ?? '',
        imagePath: item.imagePath ?? '',
        genre: item.genre ?? '',
        pageCount: String(item.pageCount ?? 0),
        whereToFind: JSON.stringify(item.whereToFind ?? []),
        eduCapesLink: item.eduCapesLink ?? '',
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
    ? books.filter((b) => {
        const q = query.toLowerCase();
        return b.title.toLowerCase().includes(q) || (b.author ?? '').toLowerCase().includes(q);
      })
    : books;

  return (
    <View style={[globalStyles.startContainer, { paddingTop: headerHeight }]}>
      <FlatList
        data={filtered}
        ListHeaderComponent={
          <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por título ou autor..." />
        }
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum livro disponível no momento.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.8}>
            <Image source={getMediaImage(item.imagePath)} style={styles.cover} resizeMode="cover" />
            <View style={styles.cardText}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              {!!item.author && <Text style={styles.author} numberOfLines={1}>{item.author}</Text>}
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
  cover: { width: '100%', height: 180 },
  cardText: { padding: 10 },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    color: Colors.text.secondary,
  },
  empty: {
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginTop: 60,
    color: Colors.text.secondary,
  },
});
