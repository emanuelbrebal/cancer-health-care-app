import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import leisureService, { Book } from '@/src/services/leisureService';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import SearchBar from '@/src/components/ui/SearchBar';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';
import { Button } from '@/src/components/ds/Button';
import { color, layout, radius, shadow, space, typography } from '@/src/constants/tokens';

export default function BooksListScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  // v1: Alert bloqueante + "Nenhum livro disponível" na falha de rede (P09).
  const { status, data, reload, refresh, refreshing } = useAsyncResource(() => leisureService.getBooks(), [], {
    emptyValue: [] as Book[],
  });

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

  const books = data ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q
    ? books.filter((b) => b.title.toLowerCase().includes(q) || (b.author ?? '').toLowerCase().includes(q))
    : books;

  const header = (
    <View style={styles.header}>
      <SearchBar label="Buscar livros" value={query} onChangeText={setQuery} placeholder="Título ou autor" />
      {status === 'success' && (
        <Text style={styles.count} accessibilityLiveRegion="polite">
          {q ? `${filtered.length} de ${books.length} livros` : `${books.length} livros recomendados`}
        </Text>
      )}
    </View>
  );

  if (status !== 'success') {
    return (
      <View style={styles.screen}>
        <View style={styles.list}>
          {header}
          {status === 'loading' && <LoadingState variant="grid" count={4} label="Carregando livros" />}
          {status === 'error' && <ErrorState title="Não conseguimos carregar os livros" onRetry={reload} />}
          {status === 'empty' && (
            <EmptyState icon="book" title="Nenhum livro por aqui ainda" message="Novas recomendações chegam em breve." />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        ListHeaderComponent={header}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={color.action.primary} />}
        ListEmptyComponent={
          <View style={styles.searchEmpty}>
            <EmptyState
              icon="search"
              title="Nenhum livro encontrado"
              message={`Não achamos resultados para "${query}". Tente outro título ou autor.`}
            />
            <Button title="Limpar busca" variant="secondary" onPress={() => setQuery('')} />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handlePress(item)}
            accessibilityRole="button"
            accessibilityLabel={item.author ? `${item.title}, de ${item.author}` : item.title}
          >
            <Image source={getMediaImage(item.imagePath)} style={styles.cover} resizeMode="cover" accessible={false} />
            <View style={styles.cardText}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              {!!item.author && <Text style={styles.author} numberOfLines={1}>{item.author}</Text>}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    gap: space.xs,
    marginBottom: space.sm,
  },
  count: {
    ...typography.small,
    color: color.text.secondary,
  },
  list: {
    paddingHorizontal: space.sm,
    paddingBottom: space.xl,
    gap: space.sm,
  },
  row: {
    justifyContent: 'space-between',
  },
  searchEmpty: {
    gap: space.sm,
  },
  card: {
    width: '48%',
    backgroundColor: color.bg.surface,
    borderRadius: radius.lg,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardPressed: {
    borderColor: color.border.brand,
    transform: [{ scale: 0.98 }],
  },
  cover: {
    width: '100%',
    height: layout.mascotMd * 2,
    backgroundColor: color.bg.brandMuted,
  },
  cardText: {
    padding: space.xs,
    gap: space.xxs,
  },
  title: {
    ...typography.smallStrong,
    color: color.text.primary,
  },
  author: {
    ...typography.caption,
    color: color.text.secondary,
  },
});
