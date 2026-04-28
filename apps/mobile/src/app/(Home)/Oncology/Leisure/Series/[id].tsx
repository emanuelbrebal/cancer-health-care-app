import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import leisureService, { Series } from '@/src/services/leisureService';

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      leisureService.getSeriesById(id)
        .then(setSeries)
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

  if (!series) return null;

  const whereToFind = series.whereToFind ?? [];
  const hasMeaningfulWhere = whereToFind.some(w => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(series.imagePath)} style={styles.poster} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{series.title}</Text>

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!series.genre && <MetaRow icon="tv" label="Gênero" value={series.genre} />}
          {!!series.showrunner && series.showrunner !== 'A definir' && (
            <MetaRow icon="user" label="Criador" value={series.showrunner} />
          )}
          {!!series.seasons && series.seasons !== 0 && (
            <MetaRow
              icon="layers"
              label="Temporadas"
              value={`${series.seasons}${series.episodes && series.episodes !== 0 ? ` · ${series.episodes} episódios` : ''}`}
            />
          )}
          {hasMeaningfulWhere && (
            <MetaRow icon="play-circle" label="Onde assistir" value={whereToFind.filter(w => w && w !== 'A definir').join(', ')} />
          )}
        </View>

        {!!series.synopsis && (
          <>
            <View style={styles.divider} />
            <Text style={styles.synopsisLabel}>Sinopse</Text>
            <Text style={styles.synopsisText}>{series.synopsis}</Text>
          </>
        )}

        {!!series.externalLink && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(series.externalLink!)}
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
