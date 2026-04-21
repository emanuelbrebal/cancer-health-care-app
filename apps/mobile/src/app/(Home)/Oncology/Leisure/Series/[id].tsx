import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';

export default function SeriesDetailScreen() {
  const params = useLocalSearchParams<{
    title: string; showrunner: string; seasons: string; episodes: string;
    imagePath: string; genre: string; whereToFind: string; externalLink: string;
  }>();

  const whereToFind: string[] = params.whereToFind ? JSON.parse(params.whereToFind) : [];
  const hasMeaningfulWhere = whereToFind.some(w => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(params.imagePath)} style={styles.poster} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{params.title}</Text>

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!params.genre && <MetaRow icon="tv" label="Gênero" value={params.genre} />}
          {!!params.showrunner && params.showrunner !== 'A definir' && (
            <MetaRow icon="user" label="Criador" value={params.showrunner} />
          )}
          {!!params.seasons && params.seasons !== '0' && (
            <MetaRow
              icon="layers"
              label="Temporadas"
              value={`${params.seasons}${params.episodes && params.episodes !== '0' ? ` · ${params.episodes} episódios` : ''}`}
            />
          )}
          {hasMeaningfulWhere && (
            <MetaRow icon="play-circle" label="Onde assistir" value={whereToFind.filter(w => w && w !== 'A definir').join(', ')} />
          )}
        </View>

        {!!params.externalLink && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(params.externalLink)}
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
