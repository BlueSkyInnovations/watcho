# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**watcho** — a React Native / Expo app for tracking movies and TV shows. Dark cinema-themed UI. Data comes from the TMDB API; all user data is stored locally via AsyncStorage.

## Setup

1. Install Node.js, then run `npm install`
2. Copy `.env.example` to `.env` and add your TMDB API key (free at themoviedb.org)
3. `npx expo start` — scan QR code with Expo Go on iOS/Android, or press `i`/`a` for simulators

## Commands

```bash
npx expo start          # Start dev server (Expo Go / simulators)
npx expo start --ios    # Launch iOS simulator directly
npx expo start --android
npm test                # Run Jest in watch mode
npm run test:single -- MyComponent   # Run tests matching a pattern
npm run lint            # ESLint via expo lint
```

## Architecture

**Routing** — Expo Router (file-based). All screens live under `app/`. The tab layout is `app/(tabs)/`. Detail screens are `app/movie/[id].tsx` and `app/tv/[id].tsx`.

**State** — `context/WatchlistContext.tsx` holds all user data in a single `useReducer`. It hydrates from AsyncStorage on mount and persists on every change. Every screen consumes this context via the `useWatchlist()` hook.

**TMDB integration** — `lib/tmdb.ts` is a thin fetch wrapper. `hooks/useTMDB.ts` exposes React hooks (`useSearch`, `useTrending`, `useMovieDetail`, `useTVDetail`) that call it. Search is debounced 400 ms.

**Types** — `types/index.ts` defines `MediaItem` (the stored user record), `TMDBMovie`, `TMDBTVShow`, `TMDBSearchResult`, and `WatchlistStats`.

**Styling** — plain `StyleSheet.create`. Color palette in `constants/Colors.ts`. No styling library.

## Key decisions

- `MediaItem.mediaType` + `MediaItem.id` together form the unique key across movies and TV shows.
- TV-only fields (`currentSeason`, `currentEpisode`, `numberOfSeasons`) are optional on `MediaItem` and only rendered when `mediaType === 'tv'` and `status === 'watching'`.
- The TMDB API key is exposed client-side via `EXPO_PUBLIC_TMDB_API_KEY` — this is intentional for a free-tier read-only key.
- `app.json` has `typedRoutes: true` so Expo Router generates typed `href` params.
