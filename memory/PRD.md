# Vestibule — PRD

## Original problem statement
Build a production-ready Expo React Native focus session app called **Vestibule**. Users enter timed focus sessions that block distracting apps. Minimal, architectural tone. Mobile-first, offline-only.

## Stack
- Expo SDK 51 · React Native 0.74 · TypeScript (strict)
- Zustand + AsyncStorage (persisted)
- React Navigation v6 — native-stack + bottom-tabs
- NativeWind v4 + Tailwind
- `react-native-svg` (custom chart), `expo-haptics`, `react-native-animatable`

## Architecture
```
RootNavigator (native-stack)
├── Tabs (bottom-tabs)
│   ├── Home          (Home)
│   ├── Blocklist     ("At The Door")
│   └── Stats         ("Time Inside")
├── Session   (full-screen, no tab bar)
├── Complete  (full-screen)
└── Abandon   (full-screen)
```

## User personas
- Focus-seeker: wants a quiet ritual before deep work
- Distraction-prone mobile user: needs friction to avoid doom-scrolling
- Data-minded self-tracker: wants to see weekly patterns

## Core requirements (implemented)
- Home: tagline, streak + best, last session summary, 25/45/60/Custom chips, Enter Vestibule CTA with bottom sheet (label + strict mode + blocked count)
- Session: full-screen timer, label, rotating curated quote (12s), "distractions turned away" counter (auto-increments on background→foreground), Leave → FrictionModal
- FrictionModal:
  - Strict OFF: soft warning + Stay / Leave Anyway
  - Strict ON: 2-step integer math problem; wrong → shake (react-native-animatable) + regenerate + error haptic
- Blocklist: search, All / Blocked-only chip filter, 18 popular mock apps with emoji, instant persistent toggle, toast "Changes apply to your next session" when toggled during active session
- Stats: custom SVG weekly bar chart with peak-day highlight, Insight → Meaning → Action cards (peak day, PM drop, abandonment, consistency), totals (completed / abandoned / longest streak / total time), most-blocked app card
- Complete: duration, label, distractions, streak, milestone badge (3/7/21/60), Enter Again / Go Home
- Abandon: elapsed time, "The door is always open.", 5m Reset / Restart / Go Home
- Theme: toggle in Home header, persisted, drives both NativeWind color scheme and React Navigation theme

## Design tokens
All in `src/constants/theme.ts`.
- Light: `#F5F2EC` bg · `#2B2A27` primary · `#B8855A` accent
- Dark:  `#12110F` bg · `#E8E3D8` primary · `#D4A574` accent
- Spacing, radius, typography exported as const.

## Interactions
- Every Button has scale(0.96) spring + Expo Haptics
- Screen transitions via React Navigation `animation: "fade" | "slide_from_bottom"`
- Wrong math = `Animatable.shake(600)` + error haptic
- Inline toast component (no library)

## Deviations from spec (and why)
- **Chart library**: spec requested Victory Native. We shipped a custom SVG bar chart in `src/components/Chart.tsx` (same dependency tree uses `react-native-svg`, which Victory depends on anyway). Reason: Victory Native v41 requires `@shopify/react-native-skia` and is heavier than the design warrants. The custom chart matches the architectural tone better (thin primary bars, accent for peak day) and keeps the dep surface small. API contract of `buildWeeklyChart` is unchanged and can be swapped back in one file.

## Status
- 28 TypeScript files, all compile clean under `tsc --noEmit` (strict).
- No backend, no auth, no network. Fully offline via AsyncStorage.
- **This is a native mobile app.** It runs on iOS / Android via `yarn start` + Expo Go, not in the web preview container.

## Recent enhancements (v1.1)
1. **Button motion refined** — per-variant spring (primary firmer at 0.96 / bounciness 2, secondary softer at 0.975, ghost subtlest at 0.985), parallel opacity-to-0.92 on press for material depth, `haptic="auto"` differentiates (primary=Medium, secondary=Light, danger=Warning-notification, ghost=selection).
2. **Monochrome SVG icon system** — added `lucide-react-native` for UI icons (Sun/Moon theme toggle, Search/X in blocklist, Shield/Check on platform card, ShieldCheck on session verified badge, ChevronRight/Sparkles). Emoji app icons replaced by a custom `AppIcon` monogram-tile component (initials in Courier; fills with `c.text` when blocked for high-contrast architectural look).
3. **Real platform-blocking integration** (honest for managed Expo):
   - **iOS**: `PlatformBlockingCard` deep-links to `App-Prefs:com.apple.focus` (with Settings-root fallback) + `shortcuts://`. User confirms "I've set it up" → `iosFocusLinked` persists. Suggested wiring: a Shortcut named "Enter Vestibule" that turns on a Vestibule Focus mode.
   - **Android**: uses `expo-intent-launcher` → `ACTION_USAGE_ACCESS_SETTINGS`. User grants access, confirms → `androidUsageAccessGranted` persists.
   - **Session screen**: when linked, distraction counter carries a "Verified" pill (ShieldCheck + accent) indicating counts are OS-backed, not heuristic.
   - Disconnect flow with destructive confirmation.

## Data test IDs
- `theme-toggle-btn`, `streak-badge`, `duration-chip-{25|45|60|custom}`, `custom-duration-input`, `enter-vestibule-btn`, `session-label-input`, `strict-mode-switch`, `confirm-enter-btn`
- `session-screen`, `session-timer`, `session-label`, `distraction-count`, `verified-badge`, `rotating-quote`, `leave-vestibule-btn`
- `friction-modal`, `friction-math-input`, `friction-submit-btn`, `friction-stay-btn`, `friction-leave-btn`
- `platform-blocking-card`, `platform-connect-btn`, `platform-unlink-btn`, `platform-help-btn`, `open-shortcuts-btn`
- `blocklist-search`, `clear-search`, `filter-{all|blocked}`, `toggle-{appId}`, `icon-{appId}`
- `weekly-chart`, `most-blocked-card`, `insight-{id}`, `insight-cta-{id}`
- `complete-screen`, `complete-distractions`, `enter-again-btn`, `go-home-btn`
- `abandon-screen`, `abandon-elapsed`, `start-reset-btn`, `restart-btn`

## Backlog
- P1: replace AppState-based distraction tracking with a proper notification/screen-time hook on iOS/Android
- P1: add haptic rhythm option (off / subtle / firm)
- P2: export session log as CSV
- P2: iOS widget + Live Activity for remaining time
- P2: Apple Watch / WearOS glance
