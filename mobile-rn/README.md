# SehatParivaar — React Native offline medicine reminder app

React Native + TypeScript + Expo Android-first app. No account, database, cloud backend, or analytics is required by this mobile app. Medicine data is stored as versioned JSON in private app storage.

## Run on Android

Requires Node.js 20+.

```sh
cd mobile-rn
npm install
npx expo install --fix
npx expo start
```

Use Expo Go for UI iteration only. Run `npm run android` to build and launch the native Android app. Notification actions, full-screen alarms, exact alarms and reboot behavior require that native development/release build; Expo Go cannot provide them. Install a native build on a physical Android phone before relying on reminders.

## Implemented in the current starter

- Guided add/edit medicine form with medicine-form selection, dose/unit presets, reminder-time shortcuts, and grouped schedule/date/stock sections; delete medicine while retaining historical dose logs.
- Multiple daily reminder times (up to eight), daily / selected-weekday / interval schedules, start/end date validation, dose quantity and instructions.
- Basic stock count +/- controls and refill-threshold warning.
- Today dose Taken / Not taken / Snooze controls and dose history.
- Refreshed reminder and history screen colors, with seven-day dose totals, adherence rate and a taken/missed/skipped bar chart.
- Per-occurrence semantic notification keys, idempotent notification reconciliation, Taken / Not taken / Snooze actions, one optional follow-up notification per scheduled dose, and reminder reconciliation on startup and app foreground. Android reminders remain visible until acted on rather than being dismissed by a swipe or tap.
- A full-screen medicine alarm screen when a dose is due, including when the phone is locked, plus actionable notification buttons. Taken and Not taken responses are recorded locally; snooze timestamps, counts and next snooze times are persisted. Snooze repeats are capped at three per dose.
- Three-step first-run onboarding (language, who medicines are for, optional nickname, and local-only privacy explanation). The optional profile is stored in AsyncStorage on this device.
- Prescription photo OCR using Google ML Kit on-device text recognition, followed by an editable review form for name, strength, dose quantity/unit, frequency, duration and instructions. Parsing recognizes common printed medicine labels, strengths, explicit quantities and dose schedules such as `1-0-1`; handwriting and unusual layouts may still need manual correction. OCR output is only a draft; users verify each medicine and enter its reminder times separately. Every saved prescription medicine then uses the same actionable alarm reminders as medicines entered manually.
- Optional medicine reference photos selected from camera or gallery, copied to app-private local storage and displayed on medicine cards. Photos are visual aids only, not verified pill identification. JSON backups do not include photo bytes; a photo URI on another device will not restore the image.
- JSON export/share; validated restore by merge or replace; previous-valid JSON recovery warning.
- English/Hindi strings for primary workflows, larger text preference applied to most main screens and form inputs, accessibility labels and tab states.
- No cloud sync; data remains on this device.

## Android reminder behavior and limitations

- The notification library/platform may assign opaque native notification identifiers; the app uses stable semantic dose keys in notification payloads and reconciles its scheduled notifications. This is not the same as a guaranteed stable OS identifier.
- Expo Notifications 0.32 does not expose an `alarmClock` delivery option. Its Android date-trigger implementation uses `setExactAndAllowWhileIdle` when Android reports exact-alarm access and falls back to `setAndAllowWhileIdle` when access is unavailable. The app declares `SCHEDULE_EXACT_ALARM` and provides a system-settings shortcut, but Expo does not expose the grant status to JavaScript. A scheduled notification is not proof that exact delivery is enabled.
- Android channel `dose_reminders_v3` uses maximum importance, the default system sound, alarm audio usage, vibration and public lock-screen visibility. Each due Android reminder is ongoing and is not auto-dismissed; it stays in the notification shade until the user records an action. Channel settings are user-controlled. Android will not let the app silently override a sound changed by the user; changing sound can require changing channel settings or creating a new channel ID. The current implementation uses the default system sound rather than a bundled custom alarm sound.
- Expo Notifications registers receivers for reboot, quick boot and app replacement and restores its scheduled requests. App launch/foreground reconciliation also refreshes times after clock or time-zone changes; if the OS keeps the app stopped, JavaScript reconciliation cannot run until it is started again.
- A local Expo config plugin patches the installed Expo Notifications Android builder to use its notification-response activity as a full-screen intent for medicine alarms. The Android app activity is configured to show and turn on the screen over the lock screen; the normal alarm screen and response handling remain in the app. No overlay or keyguard dismissal is used. This requires a native development/release build; Expo Go does not include the plugin's native changes.
- Android 10+ supports full-screen notification intents. Android 14+ and Google Play may restrict full-screen-intent access to eligible alarm/calling apps, and users can deny access. If access is denied or the device suppresses the launch, Android can show a heads-up or lock-screen notification instead. The app declares `USE_FULL_SCREEN_INTENT`, but delivery and screen presentation remain controlled by Android, notification/channel permissions, and user/device settings.
- Android/OEM delivery cannot be guaranteed. Permission denial, exact-alarm access, channel settings, force-stop behavior, battery restrictions and Vivo autostart/background controls can delay or suppress alerts. Permit notifications and background/autostart activity and review battery optimization on Vivo.
- Missed or dismissed alerts remain unresolved in Today; they are not marked taken. Follow-ups are optional and limited to one per scheduled dose. Snooze is recorded against the original scheduled dose and capped after three repeats.

## Storage and validation limitations

- JSON is not encrypted. Store exported backups securely. Restore validates the file before changing data, but recovery from every possible storage corruption scenario needs device testing.
- Schema version is currently 1. Future schema changes must include explicit migrations; an unsupported future version should not be overwritten with defaults.
- Hindi coverage is improved but not every system-generated error, notification string or accessibility announcement is translated. TalkBack must be tested with Hindi and English selected.
- Prescription OCR currently accepts JPG/PNG/WebP images only (not PDFs); handwriting and non-Latin text may be inaccurate. The selected image is processed locally and is not uploaded by this feature. Every field must be checked against the original. OCR is not a dose recommendation. The OCR package is a native module and will not work in Expo Go; use an EAS/native build.
- Medicine reference photos are copied to app-private storage and stay on this device. JSON backups do not bundle the actual photo files; users should not expect photos to transfer through a JSON-only restore. Photo-file cleanup and a bundled media backup still need more testing/design.
- Dose-log audit additions are optional fields in the existing schema, so existing medicine and history records remain readable without a data rewrite.
- No automated test runner is configured in this package. TypeScript, Expo Doctor, Android-build and physical-device checks are validation steps, not assumed passes.

## Real-device acceptance checklist

1. On Android 13+, allow and deny notification permission; verify the new `Medicine alarms · v3` channel is enabled, audible and vibrating. Changing a channel sound may require changing it in system settings.
2. On Android 12+, inspect exact-alarm access. Test with access granted and denied and record measured delivery tolerance. Revoke and restore notification and exact-alarm access.
3. Schedule a dose a few minutes ahead. Test app open, backgrounded, removed from Recents, screen locked and force-stopped separately. Record the device and OS versions, permission settings, sound/vibration, delivery time and action behavior.
4. Test TAKEN, all NOT TAKEN reasons and SNOOZE from the in-app reminder and notification actions. Verify local status, response timestamp, snooze count/history, that the Android alert remains until acted on, and absence of duplicate reminders.
5. Test a dismissed notification, follow-up, three snoozes, multiple medicines due at the same time, edits/deletion and reconciliation after relaunch.
6. Reboot, replace/update the app, change time/time zone, enable battery saver and test offline on Vivo. Verify Vivo auto-start/background/battery settings; record any delayed or missing notification.
7. Run TalkBack through onboarding, Today, settings, reminder actions and notification buttons. Test Hindi/English, large text and small-screen layout.
8. Test invalid schedules, weekday/interval schedules, JSON export/merge/replace and recovery from damaged storage without losing history.
9. From `mobile-rn`, run `npm run typecheck` and `npx expo-doctor`, then build/install a native Android development build. Report physical tests separately for app-open, background, removed-from-Recents, force-stopped and locked-screen cases.

This app is a reminder aid, not a substitute for a clinician's instructions.