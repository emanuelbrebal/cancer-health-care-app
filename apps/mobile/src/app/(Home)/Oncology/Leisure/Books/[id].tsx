import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import leisureService, { Book } from '@/src/services/leisureService';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      leisureService.getBook(id)
        .then(setBook)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.purplePrimary} />
      </View>
    );
  }

  if (!book) return null;

  const whereToFind = book.whereToFind ?? [];
  const hasMeaningfulWhere = whereToFind.some(w => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(book.imagePath)} style={styles.cover} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        {!!book.author && <Text style={styles.author}>por {book.author}</Text>}

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!book.genre && <MetaRow icon="tag" label="Gênero" value={book.genre} />}
          {!!book.pageCount && book.pageCount !== 0 && (
            <MetaRow icon="book-open" label="Páginas" value={String(book.pageCount)} />
          )}
          {hasMeaningfulWhere && (
            <MetaRow icon="map-pin" label="Onde encontrar" value={whereToFind.filter(w => w && w !== 'A definir').join(', ')} />
          )}
        </View>

        {!!book.synopsis && (
          <>
            <View style={styles.divider} />
            <Text style={styles.synopsisLabel}>Sinopse</Text>
            <Text style={styles.synopsisText}>{book.synopsis}</Text>
          </>
        )}

        {!!book.eduCapesLink && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(book.eduCapesLink!)}
              activeOpacity={0.8}
            >
              <Feather name="external-link" size={18} color="#FFF" />
              <Text style={styles.linkButtonText}>Acessar no EduCapes</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function MetaRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Feather name={icon} size={15} color={Colors.purplePrimary} />
      <Text style={styles.metaLabel}>{label}: </Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingBottom: 40 },
  cover: { width: '100%', height: 320 },
  content: { padding: 20 },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  author: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  metaSection: { gap: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaLabel: { fontFamily: 'Montserrat', fontSize: 13, fontWeight: '600', color: '#555', marginLeft: 8 },
  metaValue: { fontFamily: 'Montserrat', fontSize: 13, color: '#555', flex: 1 },
  synopsisLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purplePrimary,
    marginBottom: 8,
  },
  synopsisText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.purplePrimary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
