# SehatParivaar — offline medicine reminders

This is the Flutter mobile implementation based on the supplied Architecture and Low-Level Design document.

## Offline-first decision

- No backend, login, analytics, or network calls.
- User data will be stored in an app-private JSON file, with atomic writes and a versioned backup/restore format. This intentionally replaces the document's local Drift/SQLite database because the product requirement is **no database at all**.
- Settings use local preferences.
- Notifications are derived from saved local medicine/schedule data and reconciled on app launch/resume and after changes.
- The existing React/Vite app at the repository root is preserved as a prototype while this Flutter app is developed under `mobile/`.

## Current milestone

M0 foundation: Flutter package configuration, app entry point, routing, accessible theme, and English/Hindi ARB resources. This is a staged implementation, not yet a release-ready medicine reminder app. Notifications, JSON persistence, scheduling, history, and device testing must be completed in later milestones before relying on it for medication reminders.

## Requirements

Install the Flutter stable SDK and Android Studio / Android SDK. From this directory run:

```sh
flutter pub get
flutter gen-l10n
flutter analyze
flutter test
```

The native Android project files are generated on the developer machine with:

```sh
flutter create --platforms=android --org com.sehatparivaar .
```

If running that command in an existing directory, review its changes before accepting any generated-file overwrites. Then run `flutter run` on a connected Android device.

## Data and safety

The JSON data file is app-private and is not a database, but it must be treated as the authoritative local data store. The app should validate the complete document before replacing it, write to a temporary file and rename atomically, keep a recoverable previous copy, and reject malformed imports without destroying current data. Android notification delivery and reboot behavior must be verified on real devices (including Vivo) before production use.
