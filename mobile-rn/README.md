# SehatParivaar — React Native offline medicine reminder app

React Native + TypeScript + Expo Android-first implementation of the uploaded architecture/LLD, adapted to the product requirement of **no database and no backend**.

## Stack and privacy
- React Native + Expo, TypeScript.
- Local app data in AsyncStorage as versioned JSON; a previous known-good copy is retained before writes.
- Local notifications; no login, backend, Supabase, Firebase, analytics or cloud sync.
- Localised settings (English/Hindi), large-text preference and elder-friendly UI foundations.
- Domain types, schedule occurrence engine, validation, local storage and notification adapter separated from UI.

## Run
Requires Node.js 20+ and Expo's Android tooling. From this directory:

```sh
npm install
npx expo install --fix
npx expo start
```
Scan the QR code with Expo Go for basic UI iteration. For notification reliability and native Android configuration, use a development build and test on a real Android phone. Local notifications and background behavior must be tested on target Android versions and OEMs.

## Current implementation status
The initial React Native foundation is committed separately from the existing web prototype. The starter UI supports adding a medicine with one daily time, Today dose Taken/Skip actions, a medicine list with pause/resume, a basic history list, language/text-size preferences and local JSON persistence. The schedule engine supports daily, weekdays and interval occurrences.

**Not yet production-ready:** full 3-step medicine form, multiple-time schedule editor, editing/deletion UX, reliable per-dose notification IDs/actions, snooze/follow-up chains, reboot/time-change reconciliation, robust export/share and restore UI, full Hindi string catalog, calendar history, stock tracking, onboarding/permissions guide, and automated tests. Expo Go is not sufficient to validate all native reminder behavior. Do not rely on this starter as the sole medication reminder until the release checklist and real-device tests pass.

## Data safety
User data is stored in the app's private device storage and is not automatically shared or backed up to cloud. Uninstalling the app or clearing app storage can delete data; export/restore needs to be completed and tested before production use. JSON is not encrypted by default, so protect the device and backups.

## Android reminder checklist
- Test notification permission flow on Android 13+.
- Check exact-alarm and battery/autostart settings on Vivo, Oppo, Xiaomi and Realme.
- Test app closed, screen off, battery saver, reboot and time-zone/clock changes.
- Verify taken/skip/snooze notification actions after implementing their native handlers.
