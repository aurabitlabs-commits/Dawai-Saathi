import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { AppData, Medicine, DoseLog } from '../domain/types';
import { occurrences } from './scheduleEngine';

export const REMINDER_CHANNEL_ID='dose_reminders_v3';
const SCHEDULE_AHEAD_DAYS=7;
type DoseNotificationData = {app:'sehat-parivaar';kind:'dose'|'followup'|'snooze';medicineId:string;scheduledAt:string;doseKey:string;snoozeCount:number};

export async function requestReminderPermissions(options:{requestIfNeeded?:boolean}={}):Promise<{granted:boolean;canAskAgain:boolean;channelReady:boolean}>{
  if(Platform.OS==='android') await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID,{
    name:'Medicine alarms · v3',
    description:'High-priority medicine reminders with sound, vibration and response buttons.',
    importance:Notifications.AndroidImportance.MAX,
    sound:'default',
    enableVibrate:true,
    vibrationPattern:[0,500,250,500],
    showBadge:true,
    lockscreenVisibility:Notifications.AndroidNotificationVisibility.PUBLIC,
    audioAttributes:{usage:Notifications.AndroidAudioUsage.ALARM,contentType:Notifications.AndroidAudioContentType.SONIFICATION},
  });
  let p=await Notifications.getPermissionsAsync();
  if(options.requestIfNeeded!==false&&!p.granted&&p.canAskAgain)p=await Notifications.requestPermissionsAsync();
  const channel=Platform.OS==='android'?await Notifications.getNotificationChannelAsync(REMINDER_CHANNEL_ID):null;
  const channelReady=Platform.OS!=='android'||!!channel&&channel.importance>=Notifications.AndroidImportance.DEFAULT&&channel.sound!==null;
  return {granted:p.granted,canAskAgain:p.canAskAgain,channelReady};
}
export async function configureDoseActions():Promise<void>{
  await Notifications.setNotificationCategoryAsync('DOSE_ACTIONS',[
    {identifier:'TAKEN',buttonTitle:'Taken / ले ली',options:{opensAppToForeground:true}},
    {identifier:'NOT_TAKEN',buttonTitle:'Not taken',options:{opensAppToForeground:true}},
    {identifier:'SNOOZE',buttonTitle:'Snooze',options:{opensAppToForeground:true}},
  ]);
}
export const doseKey=(medicineId:string,at:Date)=>medicineId+'@'+at.toISOString();
export async function cancelAppReminders():Promise<void>{
  for(const n of await Notifications.getAllScheduledNotificationsAsync()) if(n.content.data?.app==='sehat-parivaar') await Notifications.cancelScheduledNotificationAsync(n.identifier);
}
export async function cancelDoseReminders(key:string):Promise<void>{
  for(const n of await Notifications.getAllScheduledNotificationsAsync()) if(n.content.data?.app==='sehat-parivaar'&&n.content.data?.doseKey===key) await Notifications.cancelScheduledNotificationAsync(n.identifier);
}
function isDoseDone(data:AppData,key:string):boolean{
  return data.doseLogs.some(log=>doseKey(log.medicineId,new Date(log.scheduledAt))===key&&log.status!=='pending');
}
function makeBody(medicine:Medicine,at:Date,language:'en'|'hi'):string{
  const time=at.toLocaleTimeString(language==='hi'?'hi-IN':'en-IN',{hour:'2-digit',minute:'2-digit',hour12:false});
  return [medicine.name,`${medicine.doseQuantity} ${medicine.doseUnit}`,medicine.strength,time,medicine.instructions].filter(Boolean).join(' · ');
}
async function scheduleReminder(medicine:Medicine,at:Date,kind:DoseNotificationData['kind'],language:'en'|'hi',snoozeCount=0,triggerAt=at):Promise<string>{
  const key=doseKey(medicine.id,at);
  const time=at.toLocaleTimeString(language==='hi'?'hi-IN':'en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});
  const body=makeBody(medicine,at,language);
  return Notifications.scheduleNotificationAsync({
    content:{
      title:`SehatParivaar · ${language==='hi'?(kind==='snooze'?'दवा का रिमाइंडर':'दवा लेने का समय'):(kind==='snooze'?'Medicine reminder':'Time to take your medicine')} · ${time}`,
      body,
      sound:'default',
      priority:Notifications.AndroidNotificationPriority.MAX,
      categoryIdentifier:'DOSE_ACTIONS',
      ...(Platform.OS==='android'?{autoDismiss:false,sticky:true}:{}),
      data:{app:'sehat-parivaar',kind,medicineId:medicine.id,scheduledAt:at.toISOString(),doseKey:key,snoozeCount} satisfies DoseNotificationData,
    },
    trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:triggerAt,...(Platform.OS==='android'?{channelId:REMINDER_CHANNEL_ID}:{})},
  });
}
export async function scheduleSnoozeReminder(medicine:Medicine,scheduledAt:string,snoozeUntil:Date,snoozeCount:number,language:'en'|'hi'):Promise<void>{
  const at=new Date(scheduledAt);
  if(Number.isNaN(at.getTime())||snoozeUntil<=new Date())throw new Error('The snooze reminder time is invalid or has already passed.');
  const key=doseKey(medicine.id,at);
  await cancelDoseReminders(key);
  await scheduleReminder(medicine,at,'snooze',language,snoozeCount,snoozeUntil);
}
export async function reconcileReminders(data:AppData):Promise<void>{
  const now=new Date(),end=new Date(now.getTime()+SCHEDULE_AHEAD_DAYS*24*60*60*1000);
  const medicines=new Map(data.medicines.filter(m=>m.isActive).map(m=>[m.id,m]));
  const desired=new Map<string,{medicine:Medicine;at:Date;kind:DoseNotificationData['kind'];count:number}>();
  for(const medicine of medicines.values())for(const at of occurrences(medicine,now,end)){
    if(at<=now)continue;
    const key=doseKey(medicine.id,at);
    if(isDoseDone(data,key))continue;
    const log=data.doseLogs.find(item=>item.medicineId===medicine.id&&item.scheduledAt===at.toISOString());
    if(log?.snoozeUntil){
      const snoozeUntil=new Date(log.snoozeUntil);
      if(snoozeUntil>now){desired.set(`${key}:snooze`,{medicine,at,kind:'snooze',count:log.snoozeCount});continue;}
    }
    desired.set(`${key}:dose`,{medicine,at,kind:'dose',count:log?.snoozeCount??0});
    if(data.settings.followupEnabled){
      const followup=new Date(at.getTime()+data.settings.followupMinutes*60000);
      if(followup>now&&followup<=end)desired.set(`${key}:followup`,{medicine,at,kind:'followup',count:log?.snoozeCount??0});
    }
  }
  for(const log of data.doseLogs){
    if(log.status!=='pending'||!log.snoozeUntil)continue;
    const snoozeUntil=new Date(log.snoozeUntil);
    const medicine=medicines.get(log.medicineId);
    const at=new Date(log.scheduledAt);
    if(medicine&&snoozeUntil>now&&!Number.isNaN(at.getTime())){
      const key=doseKey(log.medicineId,at);
      desired.set(`${key}:snooze`,{medicine,at,kind:'snooze',count:log.snoozeCount});
    }
  }
  const scheduled=await Notifications.getAllScheduledNotificationsAsync();
  const existing=new Map<string,Notifications.NotificationRequest[]>();
  for(const notification of scheduled){
    if(notification.content.data?.app!=='sehat-parivaar')continue;
    const key=String(notification.content.data.doseKey??'');
    const kind=String(notification.content.data.kind??'');
    const marker=`${key}:${kind}`;
    const list=existing.get(marker)??[];
    list.push(notification);
    existing.set(marker,list);
  }
  for(const [marker,notifications] of existing){
    if(!desired.has(marker)){for(const notification of notifications)await Notifications.cancelScheduledNotificationAsync(notification.identifier);continue;}
    for(const duplicate of notifications.slice(1))await Notifications.cancelScheduledNotificationAsync(duplicate.identifier);
    desired.delete(marker);
  }
  for(const reminder of desired.values())await scheduleReminder(reminder.medicine,reminder.at,reminder.kind,data.settings.language,reminder.count);
}
export async function cancelMedicineReminders(medicineId:string):Promise<void>{for(const n of await Notifications.getAllScheduledNotificationsAsync())if(n.content.data?.app==='sehat-parivaar'&&n.content.data?.medicineId===medicineId)await Notifications.cancelScheduledNotificationAsync(n.identifier);}
export function findDoseLog(data:AppData,medicineId:string,scheduledAt:string):DoseLog|undefined{return data.doseLogs.find(l=>l.medicineId===medicineId&&l.scheduledAt===scheduledAt);}
export type { Medicine };
