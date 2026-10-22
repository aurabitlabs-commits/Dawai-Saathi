const fs = require('node:fs');
const path = require('node:path');
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

const builderPath = path.join(
  'expo-notifications',
  'android/src/main/java/expo/modules/notifications/notifications/presentation/builders/ExpoNotificationBuilder.kt'
);
const servicePath = path.join(
  'expo-notifications',
  'android/src/main/java/expo/modules/notifications/service/NotificationsService.kt'
);

function patchFile(projectRoot, relativePath, marker, patch) {
  const filePath = path.join(projectRoot, 'node_modules', relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot enable medicine full-screen alarms: ${filePath} was not found.`);
  }

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes(marker)) return;
  const updated = patch(source);
  if (updated === source) {
    throw new Error(`Cannot enable medicine full-screen alarms: unsupported Expo Notifications source in ${filePath}.`);
  }
  fs.writeFileSync(filePath, updated);
}

function withFullScreenMedicineAlarm(config) {
  config = withAndroidManifest(config, (mod) => {
    const mainActivity = mod.modResults.manifest.application?.[0]?.activity?.find((activity) =>
      activity.$['android:name']?.endsWith('.MainActivity')
    );
    if (!mainActivity) {
      throw new Error('Cannot enable medicine full-screen alarms: Android MainActivity was not found.');
    }
    mainActivity.$['android:showWhenLocked'] = 'true';
    mainActivity.$['android:turnScreenOn'] = 'true';
    return mod;
  });

  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const projectRoot = mod.modRequest.projectRoot;
      patchFile(
        projectRoot,
        builderPath,
        'setFullScreenIntent(contentIntent, true)',
        (source) => source.replace(
          `    builder.setContentIntent(
      createNotificationResponseIntent(
        context,
        notification,
        defaultAction
      )
    )`,
          `    val contentIntent = createNotificationResponseIntent(
      context,
      notification,
      defaultAction
    )
    builder.setContentIntent(contentIntent)
    if (content.isSticky && content.categoryId == "DOSE_ACTIONS" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      builder.setCategory(NotificationCompat.CATEGORY_ALARM)
      builder.setFullScreenIntent(contentIntent, true)
    }`
        )
      );
      patchFile(
        projectRoot,
        servicePath,
        'notification.notificationRequest.content.categoryId == "DOSE_ACTIONS"',
        (source) => source.replace(
          `      if (action.opensAppToForeground() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {`,
          `      if (
        action.opensAppToForeground() &&
        (
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && notification.notificationRequest.content.categoryId == "DOSE_ACTIONS")
          )
      ) {`
        )
      );
      return mod;
    },
  ]);
}

module.exports = withFullScreenMedicineAlarm;
