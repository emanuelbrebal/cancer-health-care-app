import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';
import leisureService, { LeisureActivity } from '@/src/services/leisureService';

const TYPE_LABEL: Record<string, string> = {
  THERAPY:      'Terapêutica',
  RECREATIONAL: 'Recreativa',
  CULTURAL:     'Cultural',
  PHYSICAL:     'Física',
  SOCIAL:       'Social',
};

const FREQ_LABEL: Record<string, string> = {
  DAILY:       'Diária',
  WEEKLY:      'Semanal',
  FORTWEEKLY:  'Quinzenal',
};

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<LeisureActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      leisureService.getActivity(id)
        .then(setActivity)
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

  if (!activity) return null;

  const typeLabel = TYPE_LABEL[activity.type ?? ''] ?? activity.type;
  const freqLabel = FREQ_LABEL[activity.frequency ?? ''] ?? activity.frequency;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(activity.imagePath)} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{activity.name}</Text>

        <View style={styles.divider} />

        <View style={styles.metaSection}>
          {!!typeLabel && (
            <View style={styles.metaRow}>
              <Feather name="activity" size={15} color={Colors.purplePrimary} />
              <Text style={styles.metaLabel}>Tipo: </Text>
              <Text style={styles.metaValue}>{typeLabel}</Text>
            </View>
          )}
          {!!freqLabel && (
            <View style={styles.metaRow}>
              <Feather name="repeat" size={15} color={Colors.purplePrimary} />
              <Text style={styles.metaLabel}>Frequência recomendada: </Text>
              <Text style={styles.metaValue}>{freqLabel}</Text>
            </View>
          )}
        </View>

        {!!activity.synopsis && (
          <>
            <View style={styles.divider} />
            <Text style={styles.synopsisLabel}>Sobre esta atividade</Text>
            <Text style={styles.synopsisText}>{activity.synopsis}</Text>
          </>
        )}

        <View style={styles.tipCard}>
          <Feather name="info" size={16} color={Colors.purpleSecondary} style={{ marginBottom: 6 }} />
          <Text style={styles.tipText}>
            Atividades de lazer contribuem para o bem-estar emocional e físico durante o tratamento. Consulte sua equipe de saúde antes de iniciar qualquer atividade nova.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingBottom: 40 },
  image: { width: '100%', height: 260 },
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
  tipCard: {
    marginTop: 20,
    backgroundColor: Colors.purplePrimary + '10',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purpleSecondary,
  },
  tipText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
