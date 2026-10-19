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

Use Expo Go for UI iteration only. Notification actions, exact alarms and reboot behavior require a native development/release build. Build and install that build on a physical Android phone before relying on reminders.

## Implemented in the current starter

- Add and edit medicines; delete medicine while retaining historical dose logs.
- Multiple daily reminder times (up to eight), daily / selected-weekday / interval schedules, start/end date validation, dose quantity and instructions.
- Basic stock count +/- controls and refill-threshold warning.
- Today dose Taken / Skip / Snooze controls and dose history.
- Per-occurrence semantic notification keys, notification Taken/Snooze actions, follow-up reminder scheduling, missed-dose marking while the app is open, and reminder reconciliation on startup and app foreground.
- JSON export/share; validated restore by merge or replace; previous-valid JSON recovery warning.
- English/Hindi strings for primary workflows, larger text preference applied to most main screens and form inputs, accessibility labels and tab states.
- No cloud sync; data remains on this device.

## Important limitations — not yet verified as production-ready

- The notification library/platform may assign opaque native notification identifiers; the app uses stable semantic dose keys in notification payloads and reconciles its scheduled notifications. This is not the same as a guaranteed stable OS identifier.
- Android/OEM delivery cannot be guaranteed from JavaScript alone. Reboot rescheduling, exact-alarm access, battery restrictions, force-stop behavior, notification actions from a killed process, time-zone changes and DST must be verified on a native build and the target phone. Foreground reconciliation is implemented; do not assume it can run while the OS has stopped the app.
- Missed-dose detection runs when the app is open. It does not run as a guaranteed background worker.
- JSON is not encrypted. Store exported backups securely. Restore validates the file before changing data, but recovery from every possible storage corruption scenario needs device testing.
- Schema version is currently 1. Future schema changes must include explicit migrations; an unsupported future version should not be overwritten with defaults.
- Hindi coverage is improved but not every system-generated error, notification string or accessibility announcement is translated. TalkBack must be tested with Hindi and English selected.
- No automated tests, TypeScript check, Expo doctor, Android build or real-device test has been run as part of these commits. Treat this as an implementation pass, not release sign-off.

## Real-device acceptance checklist

1. Allow/deny notification permission on Android 13+ and verify the settings explanation.
2. Test multiple times, weekday masks, interval schedules, invalid dates, end-before-start, duplicate times and medicine edits/deletion.
3. Verify Taken and Snooze actions when app is foregrounded, backgrounded and removed from Recents.
4. Test follow-up, missed dose, low stock, export/share, invalid JSON restore, merge, replace and recovery from a damaged primary data value.
5. Reboot, change time and time zone, enable battery saver, force-stop the app, and test offline on the target Vivo/Android versions.
6. Run TalkBack across every tab, form field, switch, modal and notification action; confirm text does not clip at largest size.
7. Run `npm run typecheck`, `npx expo-doctor`, then build and install a native Android development build. Fix all errors before release.

This app is a reminder aid, not a substitute for a clinician's instructions.