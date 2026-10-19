import * as Notifications from 'expo-notifications';
import type { Medicine } from '../domain/types';

export async function requestReminderPermissions(): Promise<{granted:boolean;canAskAgain:boolean}> {
  if (process.env.EXPO_OS === 'android') await Notifications.setNotificationChannelAsync('dose_reminders',{name:'Medicine reminders',importance:Notifications.AndroidImportance.MAX,sound:'default',vibrationPattern:[0,500,250,500]});
  let permission=await Notifications.getPermissionsAsync();
  if(!permission.granted && permission.canAskAgain) permission=await Notifications.requestPermissionsAsync();
  return {granted:permission.granted,canAskAgain:permission.canAskAgain};
}
export async function scheduleDailyReminder(medicine:Medicine):Promise<string[]> {
  const ids:string[]=[];
  for(const minute of medicine.schedule.timesMinutes){
    const id=await Notifications.scheduleNotificationAsync({content:{title:'SehatParivaar · Medicine time',body:[medicine.name,medicine.strength,medicine.instructions].filter(Boolean).join(' · '),sound:'default',data:{medicineId:medicine.id}},trigger:{type:Notifications.SchedulableTriggerInputTypes.DAILY,hour:Math.floor(minute/60),minute:minute%60,channelId:'dose_reminders'}}); ids.push(id);
  }
  return ids;
}
export async function cancelMedicineReminders(medicineId:string):Promise<void>{for(const item of await Notifications.getAllScheduledNotificationsAsync())if(item.content.data?.medicineId===medicineId)await Notifications.cancelScheduledNotificationAsync(item.identifier);}
