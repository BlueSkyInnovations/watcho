# watcho

A personal movie and TV show tracker for iOS and Android, built with React Native and Expo. No account required, no ads, no subscription — everything stays on your device.

[![Translation status](https://hosted.weblate.org/widget/watcho/watcho/svg-badge.svg)](https://hosted.weblate.org/engage/watcho/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What it does

watcho lets you keep track of what you want to watch, what you're currently watching, and what you've already seen — across both movies and TV shows.

### Your three lists

| List | Purpose |
|---|---|
| **Watchlist** | Things you plan to watch |
| **Watching** | Currently in progress |
| **Watched** | Finished, done, seen |

Moving something between lists is a single tap. Everything is stored locally on the device — there is no backend, no sync, no cloud.

### What you see on a title

Open any movie or TV show and you get:

- **Backdrop, poster, genres, overview** — pulled live from TMDB in your language
- **TMDB rating** alongside your own **personal star rating**
- **Watch Trailer** button — plays YouTube trailers directly in the app, with a language filter and per-season browsing for TV shows
- **Where to Watch** — streaming, rental and purchase availability for your region, sourced from JustWatch via TMDB
- **Personal review** — a private text note saved with the title
- **More like this** — a horizontal row of recommendations
- **Progress tracking** (TV shows only) — season and episode steppers that update as you watch

Each of these sections can be individually toggled on or off in Settings.

### Search and discovery

- **Search** any movie or TV show by name — results appear as you type (400 ms debounce)
- **Trending Today** shown while the search bar is empty
- All content metadata is fetched in your selected app language

### Your stats

The Profile tab shows a summary of your activity: total watched, watching, and watchlisted titles; a movie vs. TV show breakdown; your average star rating; and your top genres by watch count.

### Sorting and layout

Each of the three tabs has its own independently persisted sort order (Date Added, Release Date, Last Updated) and view mode (grid or list). Settings survive app restarts.

### Appearance

Light, Dark, and System (follows the device setting) themes. The accent colour is a warm orange throughout.

### Internationalisation

The app ships with **English** and **German** fully translated. **Spanish** is partially available, contributed via Weblate. Device language is detected automatically on first launch; you can override it in Settings. The language picker shows a completion percentage for any language that isn't fully translated yet. The TMDB content language (titles, overviews) follows the same selection. Community translations are managed on [Weblate](https://hosted.weblate.org/engage/watcho/).

### iOS Quick Actions

On iOS, long-pressing the app icon exposes two shortcuts:
- **+1 Episode** — advances the episode counter for the most recently updated show you're watching, without opening the app
- **Continue Watching** — opens that show's detail screen directly

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- The **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), or an iOS/Android simulator

### Install and run

```bash
git clone https://github.com/BlueSkyInnovations/watcho.git
cd watcho
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` in the terminal to launch a simulator.

### TMDB API key

watcho uses [The Movie Database (TMDB)](https://www.themoviedb.org/) for all content data. TMDB is free for personal use but requires an API key.

**For end users:** the app walks you through this on first launch — you don't need to touch any config file.

**For developers running Expo Go:** same thing. Run the app, tap through the onboarding screen, paste your key. It's stored in AsyncStorage on the device and never leaves it.

**For developers running EAS builds:** do not put your key in `eas.json`. Use an EAS secret instead:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_TMDB_API_KEY --value YOUR_KEY_HERE
```

The build picks it up automatically. Your key stays out of source control.

**To get a key:**
1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to Settings → API → Request an API Key → Personal use
3. Copy the **API Key (v3 auth)** value

---

## Project structure

```
app/
  (home)/         Three tabs: My Lists, Search, Profile
  movie/[id].tsx  Movie detail screen
  tv/[id].tsx     TV show detail screen
  onboarding.tsx  First-launch API key setup
  settings.tsx    Theme, toggles, language, API key

components/       Reusable UI components
context/          WatchlistContext, SettingsContext, ThemeContext
hooks/            useColors, useTMDB, useQuickActions
lib/              tmdb.ts, apiKey.ts, i18n.ts, storage.ts
locales/          en.json, de.json, es.json  (translation files)
types/            Shared TypeScript types
```

All user data lives in AsyncStorage under namespaced keys (`watcho_watchlist_v1`, `watcho_settings`, etc.). There is no network call that sends user data anywhere.

---

## Contributing

Pull requests are welcome. Here's what to know before diving in:

### Running the app

```bash
npm install
npx expo start      # Expo Go — fastest iteration loop
npx expo run:ios    # Native dev build (needed for Quick Actions)
npx expo run:android
```

**Always test in Expo Go first.** Features that require a native dev build (currently only iOS Quick Actions) must degrade gracefully when the native module is absent — a `try/require` guard is already in place for `expo-quick-actions`.

### Code style

- **Colors:** always use `useColors()` — never hardcode hex values or import `constants/Colors` directly in screens
- **New screens:** follow the existing pattern — `useColors()` for theming, `useTranslation()` for any user-visible string
- **Watchlist identity:** `MediaItem.mediaType + MediaItem.id` is the composite key — never assume `id` alone is unique
- **TV-only fields:** `currentSeason`, `currentEpisode`, `numberOfSeasons` must only render when `mediaType === 'tv'` and `status === 'watching'`

### Adding a translation string

1. Add the key and English value to `locales/en.json`
2. Add the German translation to `locales/de.json`
3. Use `t('your.key')` in the component
4. The Weblate community will handle other languages from there

### Adding a new language

Community translators can start a new language directly on [Weblate](https://hosted.weblate.org/projects/watcho/watcho/). Once the translation file is merged:
1. Add the language code to `SUPPORTED` in `lib/i18n.ts` — completion percentage is computed automatically
2. Add an entry to `LANG_OPTIONS` in `app/settings.tsx` with the display name key
3. Add the display name string to `locales/en.json` and `locales/de.json`

### Commands

| Command | What it does |
|---|---|
| `npx expo start` | Start dev server (Expo Go) |
| `npm run ios` | Launch iOS simulator |
| `npm run android` | Launch Android emulator |
| `npm test` | Jest watch mode |
| `npm run lint` | ESLint |

---

## Translation

Translations are managed on [hosted.weblate.org/engage/watcho](https://hosted.weblate.org/engage/watcho/). If you'd like to help translate watcho into your language, just click "Start contributing" — no code required.

[![Translation status](https://hosted.weblate.org/widget/watcho/watcho/multi-auto.svg)](https://hosted.weblate.org/engage/watcho/)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 / React 19.1 |
| Navigation | Expo Router 6 (file-based, typed routes) |
| Language | TypeScript 5.8 |
| Build tooling | Expo SDK 54 / EAS |
| Persistence | AsyncStorage (device-only, no backend) |
| Content API | TMDB REST API v3 |
| Video | react-native-youtube-iframe |
| i18n | i18next + react-i18next + expo-localization |

---

## License

[MIT](LICENSE) — © 2026 Christian Jacob
