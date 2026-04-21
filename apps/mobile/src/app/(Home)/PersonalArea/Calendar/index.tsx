import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Platform, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import treatmentStorage, { Treatment, getTreatmentDates, getDaysRemaining, getProgress } from '@/src/services/treatmentStorage';
import { Ionicons } from '@expo/vector-icons';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

interface Campaign {
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
}

const CAMPAIGNS: Record<number, Campaign> = {
  2:  { title: 'Fevereiro Laranja',   subtitle: 'Conscientização da leucemia infantil',          emoji: '🧡', bgColor: '#FFF7ED', borderColor: '#FED7AA', titleColor: '#C2410C', subtitleColor: '#EA580C' },
  3:  { title: 'Março Lilás',         subtitle: 'Conscientização do Câncer de Colo do Útero',   emoji: '🎀', bgColor: '#FCE4EC', borderColor: '#F8BBD0', titleColor: '#C2185B', subtitleColor: '#D81B60' },
  6:  { title: 'Junho Laranja',       subtitle: 'Conscientização da leucemia',                   emoji: '🧡', bgColor: '#FFF7ED', borderColor: '#FED7AA', titleColor: '#C2410C', subtitleColor: '#EA580C' },
  9:  { title: 'Setembro Dourado',    subtitle: 'Conscientização do câncer infantojuvenil',      emoji: '⭐', bgColor: '#FFFBEB', borderColor: '#FDE68A', titleColor: '#92400E', subtitleColor: '#B45309' },
  10: { title: 'Outubro Rosa',        subtitle: 'Prevenção e combate ao câncer de mama',         emoji: '🎀', bgColor: '#FFF0F6', borderColor: '#FBCFE8', titleColor: '#9D174D', subtitleColor: '#BE185D' },
  11: { title: 'Novembro Azul',       subtitle: 'Conscientização do câncer de próstata',         emoji: '💙', bgColor: '#EFF6FF', borderColor: '#BFDBFE', titleColor: '#1E40AF', subtitleColor: '#2563EB' },
};

const DOT_COLORS = ['#9B5DE0', '#4E56C0', '#E040FB', '#7C4DFF', '#00BCD4', '#FF5252', '#FF9800', '#4CAF50'];

function getDayNotificationTimes(treatment: Treatment): string[] {
  const [h, m] = (treatment.horaInicio || '08:00').split(':').map(Number);
  const base = h * 60 + m;
  const freq = treatment.frequencia ?? '';
  let interval = 24 * 60;
  if (freq.includes('8 em 8')) interval = 8 * 60;
  else if (freq.includes('12 em 12')) interval = 12 * 60;
  const times: string[] = [];
  let cur = base;
  while (cur < 24 * 60) {
    times.push(`${Math.floor(cur / 60).toString().padStart(2, '0')}:${(cur % 60).toString().padStart(2, '0')}`);
    cur += interval;
  }
  return times;
}

type MarkedDates = Record<string, { dots: { color: string }[]; selected?: boolean; selectedColor?: string }>;

export default function CalendarioInterativo() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayTreatments, setDayTreatments] = useState<Treatment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth() + 1;
  const campaign = CAMPAIGNS[currentMonth];

  useFocusEffect(useCallback(() => {
    treatmentStorage.getAll().then((all) => {
      setTreatments(all);

      const marks: MarkedDates = {};
      all.forEach((t, idx) => {
        const color = DOT_COLORS[idx % DOT_COLORS.length];
        getTreatmentDates(t).forEach((date) => {
          if (!marks[date]) marks[date] = { dots: [] };
          marks[date].dots.push({ color });
        });
      });

      // Mark today
      marks[today] = {
        ...(marks[today] ?? { dots: [] }),
        selected: true,
        selectedColor: Colors.purplePrimary,
      };

      setMarkedDates(marks);
    });
  }, []));

  const handleDayPress = (day: { dateString: string }) => {
    const dateStr = day.dateString;
    setSelectedDay(dateStr);

    const dayEvents = treatments.filter((t) => getTreatmentDates(t).includes(dateStr));
    setDayTreatments(dayEvents);
    setModalVisible(true);
  };

  const totalActive = treatments.length;
  const avgProgress = totalActive > 0
    ? Math.round(treatments.reduce((acc, t) => acc + getProgress(t), 0) / totalActive)
    : 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Cabeçalho */}
          <View style={[globalStyles.titleContainer, { paddingHorizontal: 20 }]}>
            <Text style={[globalStyles.textPrimary, { fontSize: 24, fontWeight: 'bold' }]}>Meu Calendário</Text>

            {/* Campanha do mês */}
            {campaign && (
              <View style={[styles.campaignCard, { backgroundColor: campaign.bgColor, borderColor: campaign.borderColor }]}>
                <Text style={{ fontSize: 24 }}>{campaign.emoji}</Text>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[styles.campaignTitle, { color: campaign.titleColor }]}>{campaign.title}</Text>
                  <Text style={[styles.campaignSubtitle, { color: campaign.subtitleColor }]}>{campaign.subtitle}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Calendário */}
          <View style={styles.calendarCard}>
            <Calendar
              markingType="multi-dot"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              theme={{
                calendarBackground: '#FFF',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: Colors.purplePrimary,
                selectedDayTextColor: '#FFF',
                todayTextColor: Colors.purplePrimary,
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: Colors.purplePrimary,
                arrowColor: Colors.purplePrimary,
                monthTextColor: Colors.purplePrimary,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13,
              }}
            />
          </View>

          {/* Módulo de métricas */}
          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <Text style={[globalStyles.title, { marginBottom: 14 }]}>Progresso do Tratamento</Text>

            {treatments.length === 0 ? (
              <View style={styles.emptyMetrics}>
                <Ionicons name="medkit-outline" size={32} color="#CCC" />
                <Text style={styles.emptyMetricsText}>Nenhum tratamento ativo. Adicione um na tela de Tratamentos.</Text>
              </View>
            ) : (
              <>
                {treatments.map((t, idx) => {
                  const prog = getProgress(t);
                  const daysLeft = getDaysRemaining(t);
                  const color = DOT_COLORS[idx % DOT_COLORS.length];
                  return (
                    <View key={t.id} style={styles.metricCard}>
                      <View style={styles.metricHeader}>
                        <View style={[styles.metricDot, { backgroundColor: color }]} />
                        <Text style={styles.metricName} numberOfLines={1}>{t.nome}</Text>
                        <Text style={styles.metricPercent}>{prog}%</Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${prog}%`, backgroundColor: color }]} />
                      </View>
                      <Text style={styles.metricSubText}>{t.horaInicio} · {t.frequencia} · {daysLeft} dias restantes</Text>
                    </View>
                  );
                })}

                <View style={styles.motivationalCard}>
                  <Text style={styles.motivationalText}>
                    {avgProgress >= 80
                      ? `"Incrível! Você está em ${avgProgress}% do seu ciclo. Continue assim!"`
                      : avgProgress >= 50
                      ? `"Você já está em ${avgProgress}% — mais da metade do caminho!"`
                      : `"Cada dia conta. Você já está em ${avgProgress}% do tratamento. Não desista!"`}
                  </Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {/* Modal de eventos do dia */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {selectedDay ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
              </Text>

              {dayTreatments.length === 0 ? (
                <View style={styles.noEventsContainer}>
                  <Ionicons name="calendar-outline" size={32} color="#CCC" />
                  <Text style={styles.noEventsText}>Sem tratamentos neste dia.</Text>
                </View>
              ) : (
                dayTreatments.map((t, idx) => (
                  <View key={t.id} style={[styles.eventItem, { borderLeftColor: DOT_COLORS[treatments.indexOf(t) % DOT_COLORS.length] }]}>
                    <Text style={styles.eventName}>💊 {t.nome}</Text>
                    <Text style={styles.eventDetail}>Lembretes: {getDayNotificationTimes(t).join(' · ')}</Text>
                    <Text style={styles.eventDetail}>Frequência: {t.frequencia}</Text>
                    {t.nomeMedico ? <Text style={styles.eventDetail}>Dr(a). {t.nomeMedico}</Text> : null}
                  </View>
                ))
              )}

              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  campaignCard: {
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  campaignTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  campaignSubtitle: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
  calendarCard: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  emptyMetrics: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyMetricsText: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  metricCard: {
    marginBottom: 14,
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metricName: {
    flex: 1,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  metricPercent: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.purplePrimary,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricSubText: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  motivationalCard: {
    marginTop: 10,
    padding: 18,
    backgroundColor: '#F3E5F5',
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: Colors.purplePrimary,
  },
  motivationalText: {
    fontStyle: 'italic',
    color: Colors.purplePrimary,
    lineHeight: 20,
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
    minHeight: 220,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Montserrat',
    textTransform: 'capitalize',
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  noEventsText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  eventItem: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 6,
    gap: 2,
  },
  eventName: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  eventDetail: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#666',
  },
  closeBtn: {
    marginTop: 8,
    backgroundColor: Colors.purplePrimary,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 15,
  },
});
