import api from './api';

export interface DailyLog {
  id: string;
  title: string;
  emotes: string[];
  date: string;
  createdAt: string;
  content?: string;
}

const diaryService = {
  async getAll(): Promise<DailyLog[]> {
    const { data } = await api.get('/daily-logs');
    return data;
  },

  async getOne(id: string): Promise<DailyLog> {
    const { data } = await api.get(`/daily-logs/${id}`);
    return data;
  },

  async create(payload: { title: string; content: string; emotes: string[]; date?: string }): Promise<DailyLog> {
    const { data } = await api.post('/daily-logs', payload);
    return data;
  },

  async update(id: string, payload: { title?: string; content?: string; emotes?: string[] }): Promise<DailyLog> {
    const { data } = await api.patch(`/daily-logs/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/daily-logs/${id}`);
  },
};

export default diaryService;
