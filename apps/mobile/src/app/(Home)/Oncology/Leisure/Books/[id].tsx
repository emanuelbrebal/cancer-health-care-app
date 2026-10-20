import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import leisureService, { Book } from '@/src/services/leisureService';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { Button } from '@/src/components/ds/Button';
import { EmptyState, ErrorState, LoadingState, Skeleton } from '@/src/components/ds/States';
import { toastService } from '@/src/services/toastService';
import { color, iconSize, layout, radius, space, typography } from '@/src/constants/tokens';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // v1: sem tratamento de erro; uma falha deixava a tela em branco (return null).
  const { status, data: book, reload } = useAsyncResource<Book | null>(() => leisureService.getBook(id!), [id], {
    isEmpty: (b) => !b,
    emptyValue: null,
  });

  async function openLink(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      toastService.error('Não foi possível abrir o link.');
    }
  }

  if (status === 'loading') {
    return (
      <View style={styles.state}>
        <Skeleton height={layout.mascotMd * 2} rounded={radius.lg} />
        <LoadingState variant="list" count={2} label="Carregando livro" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.state}>
        <ErrorState title="Não conseguimos abrir este livro" onRetry={reload} />
        <Button title="Voltar para Livros" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  if (status === 'empty' || !book) {
    return (
      <View style={styles.state}>
        <EmptyState icon="book" title="Livro não encontrado" message="Ele pode ter sido removido das recomendações." />
        <Button title="Voltar para Livros" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const whereToFind = (book.whereToFind ?? []).filter((w) => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={getMediaImage(book.imagePath)}
        style={styles.cover}
        resizeMode="contain"
        accessibilityLabel={`Capa do livro ${book.title}`}
      />

      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">{book.title}</Text>
        {!!book.author && <Text style={styles.author}>por {book.author}</Text>}

        <View style={styles.metaSection}>
          {!!book.genre && <MetaRow icon="tag" label="Gênero" value={book.genre} />}
          {!!book.pageCount && <MetaRow icon="book-open" label="Páginas" value={String(book.pageCount)} />}
          {whereToFind.length > 0 && <MetaRow icon="map-pin" label="Onde encontrar" value={whereToFind.join(', ')} />}
        </View>

        {!!book.synopsis && (
          <View style={styles.synopsis}>
            <Text style={styles.synopsisLabel}>Sinopse</Text>
            <Text style={styles.synopsisText}>{book.synopsis}</Text>
          </View>
        )}

        {!!book.eduCapesLink && (
          <Button
            title="Ler grátis no EduCapes"
            icon="external-link"
            onPress={() => openLink(book.eduCapesLink!)}
            accessibilityHint="Abre o navegador"
            fullWidth
          />
        )}
      </View>
    </ScrollView>
  );
}

function MetaRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Feather name={icon} size={iconSize.sm} color={color.icon.brand} />
      <Text style={styles.metaText}>
        <Text style={styles.metaLabel}>{label}: </Text>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: {
    flex: 1,
    padding: space.sm,
    gap: space.md,
  },
  container: {
    paddingBottom: space.xl,
  },
  cover: {
    width: '100%',
    height: layout.mascotMd * 2 + space.xl,
    backgroundColor: color.bg.brandSubtle,
  },
  content: {
    padding: space.sm,
    gap: space.sm,
  },
  title: {
    ...typography.title,
    color: color.text.primary,
  },
  author: {
    ...typography.body,
    color: color.text.secondary,
  },
  metaSection: {
    gap: space.xs,
    paddingVertical: space.sm,
    borderTopWidth: layout.borderHairline,
    borderBottomWidth: layout.borderHairline,
    borderColor: color.border.default,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  metaText: {
    ...typography.small,
    color: color.text.secondary,
    flex: 1,
  },
  metaLabel: {
    ...typography.smallStrong,
    color: color.text.primary,
  },
  synopsis: {
    gap: space.xs,
  },
  synopsisLabel: {
    ...typography.bodyStrong,
    color: color.text.brand,
  },
  synopsisText: {
    ...typography.body,
    color: color.text.primary,
  },
});
