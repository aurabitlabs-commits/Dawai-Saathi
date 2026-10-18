/**
 * Demo / developer controls (test alarm, role switcher, sync banner, fast snooze)
 * are hidden from real users. Open the app with ?demo=1 to show them.
 */
export const isDemoMode: boolean =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('demo');
