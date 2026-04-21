import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';

export default function BookDetailScreen() {
  const params = useLocalSearchParams<{
    title: string; author: string; imagePath: string;
    genre: string; pageCount: string; whereToFind: string; eduCapesLink: string;
  }>();

  const whereToFind: string[] = params.whereToFind ? JSON.parse(params.whereToFind) : [];
  const hasMeaningfulWhere = whereToFind.some(w => w && w !== 'A definir');

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(params.imagePath)} style={styles.cover} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{params.title}</Text>
        {!!params.author && <Text style={styles.author}>por {params.author}</Text>}

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!params.genre && <MetaRow icon="tag" label="Gênero" value={params.genre} />}
          {!!params.pageCount && params.pageCount !== '0' && (
            <MetaRow icon="book-open" label="Páginas" value={params.pageCount} />
          )}
          {hasMeaningfulWhere && (
            <MetaRow icon="map-pin" label="Onde encontrar" value={whereToFind.filter(w => w && w !== 'A definir').join(', ')} />
          )}
        </View>

        {!!params.eduCapesLink && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(params.eduCapesLink)}
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
