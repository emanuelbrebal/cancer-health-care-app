import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import treatmentService from '@/src/services/treatmentService';
import * as ExpoCalendar from 'expo-calendar';
import {
  scheduleTreatmentNotifications,
  scheduleEndOfTreatmentNotification,
} from '@/src/services/notificationService';
import { DateInput } from '@/src/components/ui/Inputs/DateInput';
import { TimeInput } from '@/src/components/ui/Inputs/TimeInput';
import { PhoneInput } from '@/src/components/ui/Inputs/PhoneInput';
import { toastService } from '@/src/services/toastService';

const FREQUENCIAS = [
  '8 em 8 horas (3x ao dia)',
  '12 em 12 horas (2x ao dia)',
  '24 em 24 horas (1x ao dia)',
];

async function createCalendarEvent(nome: string, horaInicio: string, dataFim: string): Promise<string | undefined> {
  try {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') return undefined;

    const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
    const writableCalendar = calendars.find((c) => c.allowsModifications) ?? calendars[0];
    if (!writableCalendar) return undefined;

    const [h, m] = horaInicio.split(':').map(Number);
    const [day, month, year] = dataFim.split('/').map(Number);

    const startDate = new Date();
    startDate.setHours(h || 8, m || 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 0);

    const eventId = await ExpoCalendar.createEventAsync(writableCalendar.id, {
      title: `💊 ${nome}`,
      startDate,
      endDate,
      notes: `Tratamento cadastrado no OncoMente`,
      alarms: [{ relativeOffset: -30 }],
    });
    return eventId;
  } catch {
    return undefined;
  }
}

export default function CreateTreatment() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const [nome, setNome] = useState('');
  const [frequencia, setFrequencia] = useState(FREQUENCIAS[2]);
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [nomeMedico, setNomeMedico] = useState('');
  const [contatoMedico, setContatoMedico] = useState('');
  const [nomeHospital, setNomeHospital] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCalendarBanner, setShowCalendarBanner] = useState(false);
  const [errors, setErrors] = useState<{ nome?: string; horaInicio?: string; dataFim?: string }>({});

  const clearError = (field: 'nome' | 'horaInicio' | 'dataFim') =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  const validate = (): boolean => {
    const next: { nome?: string; horaInicio?: string; dataFim?: string } = {};
    if (!nome.trim()) next.nome = 'Informe o nome do remédio.';
    else if (nome.length > 150) next.nome = 'Máximo de 150 caracteres.';
    if (!horaInicio) next.horaInicio = 'Informe a hora de início.';
    else if (!/^\d{2}:\d{2}$/.test(horaInicio)) next.horaInicio = 'Formato inválido (HH:MM).';
    if (!dataFim) next.dataFim = 'Informe a data de término.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const calendarEventId = await createCalendarEvent(nome, horaInicio, dataFim);
      const treatment = await treatmentService.save({
        nome,
        frequencia,
        horaInicio,
        dataFim,
        nomeMedico: nomeMedico || undefined,
        contatoMedico: contatoMedico || undefined,
        nomeHospital: nomeHospital || undefined,
        calendarEventId,
      });

      const doseIds = await scheduleTreatmentNotifications(treatment.id, nome, horaInicio, frequencia);
      const endId = await scheduleEndOfTreatmentNotification(nome, dataFim);
      const notificationIds = [...doseIds, ...(endId ? [endId] : [])];
      if (notificationIds.length > 0) {
        await treatmentService.setNotificationIds(treatment.id, notificationIds);
      }

      toastService.success('Tratamento salvo com sucesso!');
      setShowCalendarBanner(true);
    } catch {
      toastService.error('Não foi possível salvar o tratamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[globalStyles.startContainer, { paddingTop: headerHeight }]}
    >
      <ScrollView
        contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: 10, paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
      >

        <View style={globalStyles.titleContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[globalStyles.textPrimary, { color: Colors.purplePrimary, fontSize: 24, fontWeight: '700' }]}>
            Configurar Tratamento
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[globalStyles.textSecondary, { fontSize: 14, marginTop: -4 }]}>
            Preencha os dados abaixo para iniciar o ciclo
          </Text>
        </View>

        <View style={styles.formContainer}>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Nome do Remédio</Text>
            <TextInput
              style={[styles.input, errors.nome ? styles.inputError : null]}
              value={nome}
              onChangeText={(v) => { setNome(v); clearError('nome'); }}
              placeholder="Ex: Amoxicilina 500mg"
              placeholderTextColor="#A0A0A0"
              maxLength={150}
            />
            {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <TimeInput label="Hora Início" value={horaInicio} onChangeText={(v) => { setHoraInicio(v); clearError('horaInicio'); }} error={errors.horaInicio} />
            </View>
            <View style={[styles.inputWrapper, { flex: 1.2 }]}>
              <DateInput label="Data Término" value={dataFim} onChangeText={(v) => { setDataFim(v); clearError('dataFim'); }} error={errors.dataFim} />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Frequência</Text>
            <View style={styles.chipGrid}>
              {FREQUENCIAS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFrequencia(item)}
                  style={[styles.chip, frequencia === item && { backgroundColor: Colors.purplePrimary, borderColor: Colors.purplePrimary }]}
                >
                  <Text style={[styles.chipText, frequencia === item && { color: '#FFF', fontWeight: '600' }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Médico (Opcional)</Text>
            <TextInput
              style={[styles.input, { marginBottom: 12 }]}
              placeholder="Nome completo"
              placeholderTextColor="#A0A0A0"
              value={nomeMedico}
              onChangeText={setNomeMedico}
            />
            <PhoneInput value={contatoMedico} onChangeText={setContatoMedico} />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Hospital (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da instituição"
              placeholderTextColor="#A0A0A0"
              value={nomeHospital}
              onChangeText={setNomeHospital}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btnSave, { backgroundColor: Colors.purplePrimary }]} onPress={handleSave} disabled={saving}>
            <Text style={styles.btnText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={showCalendarBanner} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>💊</Text>
            <Text style={styles.modalTitle}>Tratamento salvo!</Text>
            <Text style={styles.modalBody}>Você pode acompanhar sua evolução no Calendário Interativo.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => { setShowCalendarBanner(false); router.back(); }}>
                <Text style={styles.modalBtnSecondaryText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={() => { setShowCalendarBanner(false); router.replace('/PersonalArea/Calendar'); }}>
                <Text style={styles.modalBtnPrimaryText}>Ver Calendário</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: { paddingHorizontal: 4 },
  inputWrapper: { marginBottom: 24 },
  label: { fontFamily: 'Montserrat', fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 10, marginLeft: 4 },
  input: {
    backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12, fontSize: 16, fontFamily: 'Montserrat',
    borderWidth: 1, borderColor: '#E8E8E8', color: '#333',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  row: { flexDirection: 'row', gap: 12 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E8E8E8', backgroundColor: '#FFF' },
  chipText: { fontSize: 13, fontFamily: 'Montserrat', color: '#666' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20, width: '100%' },
  footer: { alignItems: 'center', marginTop: 10 },
  btnSave: {
    width: '50%', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: Colors.purplePrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16, fontFamily: 'Montserrat' },
  inputError: { borderColor: '#FF4C4C', borderWidth: 1.5 },
  errorText: { fontFamily: 'Montserrat', fontSize: 12, color: '#FF4C4C', marginTop: 4, marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 28, alignItems: 'center', width: '100%' },
  modalEmoji: { fontSize: 40, marginBottom: 12 },
  modalTitle: { fontFamily: 'Montserrat', fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  modalBody: { fontFamily: 'Montserrat', fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnSecondary: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  modalBtnSecondaryText: { fontFamily: 'Montserrat', fontSize: 14, color: '#666', fontWeight: '600' },
  modalBtnPrimary: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.purplePrimary, alignItems: 'center' },
  modalBtnPrimaryText: { fontFamily: 'Montserrat', fontSize: 14, color: '#FFF', fontWeight: '700' },
});
