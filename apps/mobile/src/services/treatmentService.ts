import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import type { Treatment } from './treatmentStorage';
export { getTreatmentDates, getDaysRemaining, getProgress } from './treatmentStorage';
export type { Treatment } from './treatmentStorage';

const LOCAL_IDS_KEY = 'oncomente-treatment-local-ids';

interface LocalTreatmentIds {
  notificationIds?: string[];
  calendarEventId?: string;
}

async function getLocalIds(): Promise<Record<string, LocalTreatmentIds>> {
  const raw = await AsyncStorage.getItem(LOCAL_IDS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function setLocalIds(id: string, data: LocalTreatmentIds): Promise<void> {
  const all = await getLocalIds();
  all[id] = { ...all[id], ...data };
  await AsyncStorage.setItem(LOCAL_IDS_KEY, JSON.stringify(all));
}

async function removeLocalIds(id: string): Promise<void> {
  const all = await getLocalIds();
  delete all[id];
  await AsyncStorage.setItem(LOCAL_IDS_KEY, JSON.stringify(all));
}

function isoToDDMMYYYY(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
}

function ddmmyyyyToISO(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('/');
  return `${y}-${m}-${d}`;
}

function apiToLocal(item: any, localIds?: LocalTreatmentIds): Treatment {
  return {
    id: item.id,
    nome: item.name,
    frequencia: item.frequency,
    horaInicio: item.startTime,
    dataFim: item.endDate ? isoToDDMMYYYY(item.endDate) : '',
    startDate: item.createdAt ? item.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    nomeMedico: item.doctorName,
    contatoMedico: item.doctorContact,
    nomeHospital: item.hospitalName,
    notificationIds: localIds?.notificationIds,
    calendarEventId: localIds?.calendarEventId,
  };
}

const treatmentService = {
  async getAll(): Promise<Treatment[]> {
    const { data } = await api.get('/personal/treatments');
    const stored = await getLocalIds();
    return (data as any[]).map((item) => apiToLocal(item, stored[item.id]));
  },

  async save(payload: Omit<Treatment, 'id' | 'startDate'>): Promise<Treatment> {
    const dto = {
      name: payload.nome,
      frequency: payload.frequencia,
      startTime: payload.horaInicio,
      endDate: ddmmyyyyToISO(payload.dataFim),
      doctorName: payload.nomeMedico || undefined,
      doctorContact: payload.contatoMedico || undefined,
      hospitalName: payload.nomeHospital || undefined,
    };
    const { data } = await api.post('/personal/treatments', dto);
    const treatment = apiToLocal(data);
    if (payload.calendarEventId) {
      await setLocalIds(treatment.id, { calendarEventId: payload.calendarEventId });
      treatment.calendarEventId = payload.calendarEventId;
    }
    return treatment;
  },

  async update(id: string, payload: Partial<Omit<Treatment, 'id'>>): Promise<void> {
    const dto: Record<string, any> = {};
    if (payload.nome !== undefined) dto.name = payload.nome;
    if (payload.frequencia !== undefined) dto.frequency = payload.frequencia;
    if (payload.horaInicio !== undefined) dto.startTime = payload.horaInicio;
    if (payload.dataFim !== undefined) dto.endDate = ddmmyyyyToISO(payload.dataFim);
    if (payload.nomeMedico !== undefined) dto.doctorName = payload.nomeMedico;
    if (payload.contatoMedico !== undefined) dto.doctorContact = payload.contatoMedico;
    if (payload.nomeHospital !== undefined) dto.hospitalName = payload.nomeHospital;
    await api.patch(`/personal/treatments/${id}`, dto);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/personal/treatments/${id}`);
    await removeLocalIds(id);
  },

  async setNotificationIds(id: string, notificationIds: string[]): Promise<void> {
    await setLocalIds(id, { notificationIds });
  },
};

export default treatmentService;
