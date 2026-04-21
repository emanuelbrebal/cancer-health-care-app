import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import { getMediaImage } from '@/src/constants/mediaImageMap';

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
  const params = useLocalSearchParams<{
    name: string; imagePath: string; type: string; frequency: string;
  }>();

  const typeLabel = TYPE_LABEL[params.type] ?? params.type;
  const freqLabel = FREQ_LABEL[params.frequency] ?? params.frequency;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={getMediaImage(params.imagePath)} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{params.name}</Text>

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
