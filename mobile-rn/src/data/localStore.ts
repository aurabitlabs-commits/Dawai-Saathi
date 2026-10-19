import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Medicine, DoseLog } from '../domain/types';

const DATA_KEY = 'sehat-parivaar:data:v1';
const BACKUP_KEY = 'sehat-parivaar:data:previous:v1';
const DEFAULTS: AppData = { schemaVersion: 1, medicines: [], doseLogs: [], settings: { language: 'en', textScale: 1, snoozeMinutes: 10, followupEnabled: true, followupMinutes: 10, missedGraceMinutes: 60, onboardingDone: false } };
let writeQueue: Promise<void> = Promise.resolve();
let recoveryNotice = '';

function validDate(s: unknown): s is string { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s + 'T00:00:00').getTime()); }
function validMedicine(x: unknown): x is Medicine {
  if (!x || typeof x !== 'object') return false;
  const m=x as Medicine;
  return typeof m.id==='string' && typeof m.name==='string' && m.name.trim().length>0 &&
    typeof m.doseQuantity==='number' && m.doseQuantity>0 && typeof m.doseUnit==='string' &&
    validDate(m.startDate) && typeof m.isActive==='boolean' && !!m.schedule &&
    ['daily','weekdays','interval'].includes(m.schedule.type) && Array.isArray(m.schedule.timesMinutes) &&
    m.schedule.timesMinutes.length>0 && m.schedule.timesMinutes.every(n=>Number.isInteger(n)&&n>=0&&n<=1439) &&
    (m.schedule.type!=='weekdays'||Number.isInteger(m.schedule.weekdaysMask)&&!!m.schedule.weekdaysMask) &&
    (m.schedule.type!=='interval'||Number.isInteger(m.schedule.intervalDays)&&!!m.schedule.intervalDays&&validDate(m.schedule.anchorDate));
}
function validLog(x: unknown): x is DoseLog {
  if(!x||typeof x!=='object')return false; const d=x as DoseLog;
  return typeof d.id==='string'&&typeof d.medicineId==='string'&&!Number.isNaN(Date.parse(d.scheduledAt))&&validDate(d.localDate)&&['pending','taken','skipped','missed'].includes(d.status)&&Number.isInteger(d.snoozeCount)&&d.snoozeCount>=0;
}
function validateData(value: unknown): value is AppData {
  if(!value||typeof value!=='object')return false; const v=value as Partial<AppData>;
  return v.schemaVersion===1&&Array.isArray(v.medicines)&&v.medicines.every(validMedicine)&&Array.isArray(v.doseLogs)&&v.doseLogs.every(validLog)&&!!v.settings&&
    ['en','hi'].includes(v.settings.language)&&[1,1.3,1.6].includes(v.settings.textScale)&&[5,10,15].includes(v.settings.snoozeMinutes)&&typeof v.settings.followupEnabled==='boolean'&&Number.isInteger(v.settings.followupMinutes)&&Number.isInteger(v.settings.missedGraceMinutes);
}
async function readValid(raw:string|null):Promise<AppData|null>{if(!raw)return null;try{const p:unknown=JSON.parse(raw);return validateData(p)?p:null;}catch{return null;}}
export const localStore = {
  async read(): Promise<AppData> {
    const raw=await AsyncStorage.getItem(DATA_KEY); const current=await readValid(raw);
    if(current){recoveryNotice='';return current;}
    if(raw){const backup=await readValid(await AsyncStorage.getItem(BACKUP_KEY));if(backup){recoveryNotice='The latest saved data was damaged. The previous valid backup was recovered; please export a fresh backup.';return backup;}
      recoveryNotice='Both the latest data and previous backup could not be read. A new empty record is shown; do not save over it if you need to recover data.';return structuredClone(DEFAULTS);}
    recoveryNotice='';return structuredClone(DEFAULTS);
  },
  getRecoveryNotice():string{return recoveryNotice;},
  async write(next:AppData):Promise<void>{
    if(!validateData(next))throw new Error('Data validation failed; no changes were saved.');
    const task=writeQueue.then(async()=>{
      const current=await AsyncStorage.getItem(DATA_KEY);
      if(current && await readValid(current)) await AsyncStorage.setItem(BACKUP_KEY,current);
      await AsyncStorage.setItem(DATA_KEY,JSON.stringify(next));
      recoveryNotice='';
    });
    writeQueue=task.catch(()=>undefined);return task;
  },
  async upsertMedicine(medicine:Medicine):Promise<void>{const d=await this.read();const i=d.medicines.findIndex(m=>m.id===medicine.id);if(i<0)d.medicines.push(medicine);else d.medicines[i]=medicine;await this.write(d);},
  async removeMedicine(id:string):Promise<void>{const d=await this.read();d.medicines=d.medicines.filter(m=>m.id!==id);d.doseLogs=d.doseLogs.filter(x=>x.medicineId!==id);await this.write(d);},
  async updateDose(dose:DoseLog):Promise<void>{const d=await this.read();const i=d.doseLogs.findIndex(x=>x.id===dose.id);if(i<0)d.doseLogs.push(dose);else d.doseLogs[i]=dose;await this.write(d);},
  async updateSettings(settings:AppData['settings']):Promise<void>{const d=await this.read();d.settings=settings;await this.write(d);},
  async exportJson():Promise<string>{return JSON.stringify(await this.read(),null,2);},
  async importJson(raw:string,mode:'replace'|'merge'):Promise<void>{
    let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new Error('This backup is not valid JSON.');}
    if(!validateData(parsed))throw new Error('This backup is invalid or from an unsupported version. Existing data was not changed.');
    const incoming=parsed as AppData;if(mode==='replace'){await this.write(incoming);return;}
    const current=await this.read();const meds=new Map(current.medicines.map(m=>[m.id,m]));incoming.medicines.forEach(m=>meds.set(m.id,m));
    const logs=new Map(current.doseLogs.map(l=>[l.id,l]));incoming.doseLogs.forEach(l=>logs.set(l.id,l));
    await this.write({...current,medicines:[...meds.values()],doseLogs:[...logs.values()],settings:incoming.settings});
  },
};
