import * as Notifications from 'expo-notifications';
import type { AppData, Medicine, DoseLog } from '../domain/types';
import { occurrences } from './scheduleEngine';

const CHANNEL='dose_reminders';
export async function requestReminderPermissions():Promise<{granted:boolean;canAskAgain:boolean}>{
  if(process.env.EXPO_OS==='android') await Notifications.setNotificationChannelAsync(CHANNEL,{name:'Medicine reminders',importance:Notifications.AndroidImportance.MAX,sound:'default',vibrationPattern:[0,500,250,500]});
  let p=await Notifications.getPermissionsAsync();if(!p.granted&&p.canAskAgain)p=await Notifications.requestPermissionsAsync();return {granted:p.granted,canAskAgain:p.canAskAgain};
}
export async function configureDoseActions():Promise<void>{
  await Notifications.setNotificationCategoryAsync('DOSE_ACTIONS',[
    {identifier:'TAKEN',buttonTitle:'Taken / ले ली',options:{opensAppToForeground:false}},
    {identifier:'SNOOZE',buttonTitle:'Snooze / बाद में',options:{opensAppToForeground:false}},
  ]);
}
export const doseKey=(medicineId:string,at:Date)=>medicineId+'@'+at.toISOString();
export async function cancelAppReminders():Promise<void>{
  for(const n of await Notifications.getAllScheduledNotificationsAsync()) if(n.content.data?.app==='sehat-parivaar') await Notifications.cancelScheduledNotificationAsync(n.identifier);
}
export async function reconcileReminders(data:AppData):Promise<void>{
  await cancelAppReminders();
  const now=new Date(),end=new Date(now);end.setDate(end.getDate()+14);
  const active=data.medicines.filter(m=>m.isActive);
  for(const m of active){
    for(const at of occurrences(m,now,end)){
      if(at<=now)continue;
      const key=doseKey(m.id,at);
      if(data.doseLogs.some(l=>doseKey(l.medicineId,new Date(l.scheduledAt))===key&&l.status!=='pending'))continue;
      const body=[m.name,m.strength,m.instructions].filter(Boolean).join(' · ');
      await Notifications.scheduleNotificationAsync({content:{title:'SehatParivaar · Medicine time',body,sound:'default',categoryIdentifier:'DOSE_ACTIONS',data:{app:'sehat-parivaar',kind:'dose',medicineId:m.id,scheduledAt:at.toISOString(),doseKey:key}},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:at, ...(process.env.EXPO_OS==='android'?{channelId:CHANNEL}:{})}});
      if(data.settings.followupEnabled){
        const follow=new Date(at.getTime()+data.settings.followupMinutes*60000);
        if(follow>now&&follow<end&&!data.doseLogs.some(l=>doseKey(l.medicineId,new Date(l.scheduledAt))===key&&['taken','skipped'].includes(l.status))){
          await Notifications.scheduleNotificationAsync({content:{title:'SehatParivaar · Reminder',body:'Reminder: '+body,sound:'default',categoryIdentifier:'DOSE_ACTIONS',data:{app:'sehat-parivaar',kind:'followup',medicineId:m.id,scheduledAt:at.toISOString(),doseKey:key}},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:follow, ...(process.env.EXPO_OS==='android'?{channelId:CHANNEL}:{})}});
        }
      }
    }
  }
}
export async function cancelMedicineReminders(medicineId:string):Promise<void>{for(const n of await Notifications.getAllScheduledNotificationsAsync())if(n.content.data?.app==='sehat-parivaar'&&n.content.data?.medicineId===medicineId)await Notifications.cancelScheduledNotificationAsync(n.identifier);}
export function findDoseLog(data:AppData,medicineId:string,scheduledAt:string):DoseLog|undefined{return data.doseLogs.find(l=>l.medicineId===medicineId&&l.scheduledAt===scheduledAt);}
export type { Medicine };
