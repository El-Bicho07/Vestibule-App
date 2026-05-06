# Vestibule

**Step inside. Leave the noise behind.**

A production-ready, offline-only focus session app built with Expo + React Native. Minimal, architectural tone. Mobile-first.

## Stack

- Expo SDK 51 · TypeScript · React Native 0.74
- Zustand + AsyncStorage (persisted state)
- React Navigation v6 (bottom tabs + native stack)
- NativeWind v4 (Tailwind styling)
- Custom SVG chart (react-native-svg) · Expo Haptics · react-native-animatable

## Getting started

```bash
# Install dependencies
yarn install

# Start the Metro bundler
npx expo start

# Or go directly to a platform
yarn ios        # iOS simulator (macOS only)
yarn android    # Android emulator / device
```

Open the QR code in **expo-dev-client / development build** on your device, or press `i` / `a` in the terminal to launch a simulator.

## Project structure

```
/src
  /components      Button · Card · Timer · Chart · FrictionModal · StreakBadge
  /screens         Home · Session · Blocklist · Stats · Complete · Abandon
  /store           session · blocklist · stats · theme  (Zustand + AsyncStorage)
  /utils           time · insights · mathGenerator
  /constants       theme · config · quotes
  /navigation      RootNavigator · TabNavigator
App.tsx
```

## Features

- **Home** — tagline, streak, last session, 25/45/60/Custom duration chips, bottom sheet for label + strict mode
- **Session** — full-screen timer, label, "distractions turned away" counter (auto-increments on app background → foreground), rotating quotes, Leave button → friction modal
- **Friction Modal**
  - Strict OFF: soft warning "Leaving early won't count toward your streak."
  - Strict ON: 2-step math problem, wrong answer shakes + regenerates, haptic error
- **Blocklist** ("At The Door") — search, All/Blocked filter, instant toggles, inline toast if session is active
- **Stats** ("Time Inside") — weekly bar chart with peak highlight, Insight → Meaning → Action cards, totals, most-blocked app
- **Complete** — duration, label, distractions, streak update, milestone badge (3 / 7 / 21 / 60)
- **Abandon** — elapsed time, "The door is always open.", 5m Reset / Restart / Go Home

## Design system

All tokens live in `src/constants/theme.ts` — light and dark palettes inspired by weathered stone, ivory walls, warm wood.

- Light: `#F5F2EC` background · `#2B2A27` primary · `#B8855A` accent
- Dark:  `#12110F` background · `#E8E3D8` primary · `#D4A574` accent

Theme toggle in the Home header. Persists via AsyncStorage.

## Offline-only

No backend. No auth. No ads. Everything persists via `@react-native-async-storage/async-storage`.

## Notes for running

This app targets iOS / Android via expo-dev-client / development build (SDK 51). It is not intended to run in a web browser — the minimal, full-screen mobile layouts and native haptics are the point.

---

Designed and built to feel like a small architectural room rather than a productivity dashboard.
