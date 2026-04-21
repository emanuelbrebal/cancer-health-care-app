import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'oncomente-treatments';

export interface Treatment {
  id: string;
  nome: string;
  frequencia: string;
  horaInicio: string;
  dataFim: string;       // 'DD/MM/YYYY'
  startDate: string;     // 'YYYY-MM-DD'
  nomeMedico?: string;
  contatoMedico?: string;
  nomeHospital?: string;
  obs?: string;
  calendarEventId?: string;
  notificationIds?: string[];
}

async function getAll(): Promise<Treatment[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function save(treatment: Omit<Treatment, 'id' | 'startDate'>): Promise<Treatment> {
  const all = await getAll();
  const newItem: Treatment = {
    ...treatment,
    id: Date.now().toString(),
    startDate: new Date().toISOString().split('T')[0],
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...all, newItem]));
  return newItem;
}

async function update(id: string, data: Partial<Omit<Treatment, 'id'>>): Promise<void> {
  const all = await getAll();
  const updated = all.map((t) =>
    t.id === id ? { ...t, ...data, startDate: new Date().toISOString().split('T')[0] } : t,
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

async function remove(id: string): Promise<void> {
  const all = await getAll();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((t) => t.id !== id)));
}

async function setNotificationIds(id: string, notificationIds: string[]): Promise<void> {
  const all = await getAll();
  const updated = all.map((t) => (t.id === id ? { ...t, notificationIds } : t));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Returns all YYYY-MM-DD dates a treatment covers (one per day from startDate to dataFim).
export function getTreatmentDates(treatment: Treatment): string[] {
  const [day, month, year] = treatment.dataFim.split('/').map(Number);
  const end = new Date(year, month - 1, day);
  const start = new Date(treatment.startDate);
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function getDaysRemaining(treatment: Treatment): number {
  const [day, month, year] = treatment.dataFim.split('/').map(Number);
  const end = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getProgress(treatment: Treatment): number {
  const [day, month, year] = treatment.dataFim.split('/').map(Number);
  const end = new Date(year, month - 1, day);
  const start = new Date(treatment.startDate);
  const today = new Date();
  const total = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

const treatmentStorage = { getAll, save, update, remove, setNotificationIds };
export default treatmentStorage;
