import { Colors } from '@/src/constants/Colors';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { meditationData } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIPS = [
  { icon: 'wind' as const,    text: 'Respire lenta e profundamente' },
  { icon: 'eye-off' as const, text: 'Feche os olhos e relaxe o corpo' },
  { icon: 'clock' as const,   text: 'Reserve 5 a 15 minutos do seu dia' },
];

const meditationWithMeta = meditationData.map((item, idx) => ({
  ...item,
  id: String(item.id),
  duration: ['10 min', '12 min', '15 min', '10 min', '5 min'][idx] ?? '10 min',
  type: ['Relaxamento', 'Mindfulness', 'Confiança', 'Conexão', 'Mindfulness'][idx] ?? 'Meditação',
}));

export default function Meditation() {
  return (
    <SafeAreaView style={{ flex: 1  }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.heroBanner}>
          <Feather name="moon" size={28} color="#FFF" />
          <Text style={styles.heroTitle}>Um momento para respirar</Text>
          <Text style={styles.heroSubtitle}>
            A meditação acalma a mente, reduz a ansiedade e traz mais equilíbrio emocional.
          </Text>
        </View>

        <View style={styles.tipsRow}>
          {TIPS.map((tip, idx) => (
            <View key={idx} style={styles.tipChip}>
              <Feather name={tip.icon} size={15} color={Colors.purplePrimary} />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Playlist de Meditação Guiada</Text>
        <Text style={styles.sectionSubtitle}>
          Toque em um exercício para expandir e iniciar o vídeo.
        </Text>

        <View style={styles.metaGrid}>
          {meditationWithMeta.map((item) => (
            <View key={item.id} style={styles.metaCard}>
              <View style={styles.metaCardHeader}>
                <View style={styles.durationBadge}>
                  <Feather name="clock" size={11} color={Colors.purplePrimary} />
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              </View>
              <MediaList items={[item]} />
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  heroBanner: {
    backgroundColor: '#4E56C0',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsRow: {
    gap: 8,
  },
  tipChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.purplePrimary,
  },
  tipText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#444',
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#888',
    marginTop: -10,
  },
  metaGrid: {
    gap: 4,
  },
  metaCard: {
    gap: 8,
  },
  metaCardHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  durationText: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.purplePrimary,
  },
  typeBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '600',
    color: '#4E56C0',
  },
});
