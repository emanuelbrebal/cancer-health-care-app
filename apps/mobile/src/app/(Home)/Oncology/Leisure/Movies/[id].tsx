import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import leisureService, { Movie } from '@/src/services/leisureService';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      leisureService.getMovie(id)
        .then(setMovie)
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

  if (!movie) return null;

  const whereToFind = movie.whereToFind ?? [];
  const hasMeaningfulWhere = whereToFind.some(w => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(movie.imagePath)} style={styles.poster} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        {!!movie.releaseYear && <Text style={styles.year}>{movie.releaseYear}</Text>}

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!movie.genre && <MetaRow icon="film" label="Gênero" value={movie.genre} />}
          {!!movie.director && movie.director !== 'A definir' && (
            <MetaRow icon="user" label="Diretor" value={movie.director} />
          )}
          {!!movie.duration && movie.duration !== 'A definir' && (
            <MetaRow icon="clock" label="Duração" value={movie.duration} />
          )}
          {hasMeaningfulWhere && (
            <MetaRow icon="tv" label="Onde assistir" value={whereToFind.filter(w => w && w !== 'A definir').join(', ')} />
          )}
        </View>

        {!!movie.synopsis && (
          <>
            <View style={styles.divider} />
            <Text style={styles.synopsisLabel}>Sinopse</Text>
            <Text style={styles.synopsisText}>{movie.synopsis}</Text>
          </>
        )}

        {!!movie.externalLink && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(movie.externalLink!)}
              activeOpacity={0.8}
            >
              <Feather name="play-circle" size={18} color="#FFF" />
              <Text style={styles.linkButtonText}>Assistir agora</Text>
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
  poster: { width: '100%', height: 280 },
  content: { padding: 20 },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  year: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: Colors.text.secondary,
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
