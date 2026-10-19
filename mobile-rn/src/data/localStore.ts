import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Medicine, DoseLog } from '../domain/types';

const DATA_KEY = 'sehat-parivaar:data:v1';
const BACKUP_KEY = 'sehat-parivaar:data:previous:v1';
const DEFAULTS: AppData = {
  schemaVersion: 1, medicines: [], doseLogs: [],
  settings: { language: 'en', textScale: 1, snoozeMinutes: 10, followupEnabled: true, followupMinutes: 10, missedGraceMinutes: 60, onboardingDone: false },
};
let writeQueue: Promise<void> = Promise.resolve();

function validateData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<AppData>;
  return v.schemaVersion === 1 && Array.isArray(v.medicines) && Array.isArray(v.doseLogs) && !!v.settings && typeof v.settings === 'object';
}

export const localStore = {
  async read(): Promise<AppData> {
    const raw = await AsyncStorage.getItem(DATA_KEY);
    if (!raw) return DEFAULTS;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (validateData(parsed)) return parsed;
    } catch { /* recover from the last known-good copy below */ }
    const previous = await AsyncStorage.getItem(BACKUP_KEY);
    if (previous) {
      try { const parsed: unknown = JSON.parse(previous); if (validateData(parsed)) return parsed; } catch { /* return safe defaults */ }
    }
    return DEFAULTS;
  },
  async write(next: AppData): Promise<void> {
    if (!validateData(next)) throw new Error('Invalid SehatParivaar data; nothing was saved.');
    const task = writeQueue.then(async () => {
      const current = await AsyncStorage.getItem(DATA_KEY);
      if (current) await AsyncStorage.setItem(BACKUP_KEY, current);
      await AsyncStorage.setItem(DATA_KEY, JSON.stringify(next));
    });
    writeQueue = task.catch(() => undefined);
    return task;
  },
  async upsertMedicine(medicine: Medicine): Promise<void> {
    const data = await this.read(); const index = data.medicines.findIndex(m => m.id === medicine.id);
    if (index < 0) data.medicines.push(medicine); else data.medicines[index] = medicine;
    await this.write(data);
  },
  async removeMedicine(id: string): Promise<void> {
    const data = await this.read(); data.medicines = data.medicines.filter(m => m.id !== id);
    // Keep historical dose snapshots/logs; remove only future pending items.
    data.doseLogs = data.doseLogs.filter(d => d.medicineId !== id || d.status !== 'pending' || new Date(d.scheduledAt) <= new Date());
    await this.write(data);
  },
  async updateDose(dose: DoseLog): Promise<void> {
    const data = await this.read(); const index = data.doseLogs.findIndex(d => d.id === dose.id);
    if (index < 0) data.doseLogs.push(dose); else data.doseLogs[index] = dose;
    await this.write(data);
  },
  async updateSettings(settings: AppData['settings']): Promise<void> { const data = await this.read(); data.settings = settings; await this.write(data); },
  async exportJson(): Promise<string> { return JSON.stringify(await this.read(), null, 2); },
  async importJson(raw: string, mode: 'replace' | 'merge'): Promise<void> {
    let incoming: unknown; try { incoming = JSON.parse(raw); } catch { throw new Error('This backup is not valid JSON.'); }
    if (!validateData(incoming)) throw new Error('Unsupported or invalid backup file. Your existing data has not changed.');
    const next = mode === 'replace' ? incoming : (() => {
      const current = this.read(); return current;
    })();
    if (mode === 'replace') { await this.write(incoming); return; }
    const current = await this.read();
    const medicines = new Map(current.medicines.map(m => [m.id, m])); incoming.medicines.forEach(m => medicines.set(m.id, m));
    const logs = new Map(current.doseLogs.map(d => [d.id, d])); incoming.doseLogs.forEach(d => logs.set(d.id, d));
    await this.write({ ...current, medicines: [...medicines.values()], doseLogs: [...logs.values()], settings: incoming.settings });
    void next;
  },
};
