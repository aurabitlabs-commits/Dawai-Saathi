# UI/UX fixes for 50+ users

## Safety / correctness
- Spoken reminders no longer say "morning / one tablet / after food" for every dose; text is built from the dose's real time, dosage and meal relation (`utils/doseText.ts`).
- "After food" label now comes from each medicine's `mealRelation` (was hard-coded).
- Fixed `nextDose` fallback (`|| doses[0]`) that hid the "all medicines taken" state; counter now uses today's doses only.
- New days now get dose records automatically (AppContext effect) so the schedule is never empty after midnight.
- Confirmation screen has an Undo button for accidental taps; its date is no longer hard-coded.

## Accessibility
- Pinch-zoom re-enabled (removed `user-scalable=no`).
- Root font 18px (scalable via `data-text="large|xlarge"` on <html>), Devanagari line-height/letter-spacing fixed, visible focus ring, reduced-motion support.
- Elder text raised to 16-30px; touch targets 56-96px; darker text/contrast on elder screens.
- Modals: role="dialog", aria-modal, labels, Escape handling; icon buttons have aria-labels.

## Layout
- Elder home: one big button per dose, doses grouped by Morning / Afternoon / Evening / Night, personal "Call Neha" button with photo, sharing status moved to a quiet footer.
- Reminder dialog: removed the silent-dismiss "X"; Escape = remind later.
- Demo/test controls (sync banner, alarm test, role switcher, 5s snooze) are hidden unless the URL has `?demo=1`.
- Images moved to `public/images` so they still load in production builds.

## Not yet done
- Caregiver screens (dashboard, schedule, stock, history, family) still use small text and slate-400/500 colours.
- Add Medicine is still one long form (wizard recommended) with pre-filled defaults.
- Bottom nav still has 6 tabs (recommend 4).
- Greeting still says "पापा" (should come from the elder profile).
- Real background alarms need native notifications (e.g. Capacitor).
