# Project: watcho

React Native / Expo app for tracking movies and TV shows. All user data is stored locally via AsyncStorage; content data comes from the TMDB API.

## Stack
- React Native 0.81.5 · React 19.1 · TypeScript 5.8
- Expo ~54 · Expo Router ~6 (`typedRoutes: true`, file-based routing)
- AsyncStorage — only persistence layer (no backend)

## Commands
- `npx expo start` — dev server; scan QR with Expo Go or press `i`/`a` for simulators
- `npx expo start --ios` / `--android` — launch simulator directly
- `npm test` — Jest watch mode
- `npm run lint` — ESLint

## Structure
- `app/(home)/` — Expo Router group for 3 tabs: index (My Lists), search, profile
- `app/movie/[id].tsx`, `app/tv/[id].tsx` — detail screens
- `app/onboarding.tsx` — first-run screen for entering a TMDB API key
- `app/settings.tsx` — theme + API key settings, pushed from profile header gear icon
- `context/WatchlistContext.tsx` — all watchlist state via `useReducer`, hydrates from AsyncStorage
- `context/ThemeContext.tsx` — theme preference (`light` / `dark` / `system`)
- `hooks/useColors.ts` — resolved color palette (use this everywhere)
- `lib/tmdb.ts` — TMDB fetch wrapper; `hooks/useTMDB.ts` — React hooks over it
- `lib/apiKey.ts` — AsyncStorage helpers for the user-provided TMDB API key
- `lib/storage.ts` — watchlist persistence helpers (`watcho_watchlist_v1`)
- `lib/youtube.ts` — YouTube trailer utilities
- `types/index.ts` — `MediaItem`, `TMDBMovie`, `TMDBTVShow`, `WatchStatus`, etc.

## Rules
- Use `useColors()` everywhere for colors. Never import `constants/Colors` directly.
- Apply colors inline: `[styles.foo, { color: colors.text }]` — no hardcoded color values.
- `MediaItem.mediaType` + `MediaItem.id` is the unique composite key for watchlist entries.
- TV-only fields (`currentSeason`, `currentEpisode`, `numberOfSeasons`) render only when `mediaType === 'tv'` and `status === 'watching'`.

## Domain
- **WatchStatus**: `'watchlist'` | `'watching'` | `'watched'`
- **TMDB API key**: user-provided at runtime, stored in AsyncStorage via `lib/apiKey.ts` (`watcho_tmdb_api_key`). `EXPO_PUBLIC_TMDB_API_KEY` env var is a build-time fallback — exposing it client-side is intentional (free-tier read-only key).
- **Sort preferences**: per-tab, persisted under `watcho_sort_prefs`. Options: Date Added, Release Date, Last Updated. `MediaItem.updatedAt` is stamped on every status/rating/progress change.
- **Search**: debounced 400 ms in `hooks/useTMDB.ts`.
