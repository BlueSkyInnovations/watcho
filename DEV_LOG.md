# watcho — Development Log

Every user prompt, categorised by type, with a summary of the work done and its outcome.

**Types:** `idea` · `requirement` · `bug` · `examination` · `experience` · `decision`

---

## Session 1 — 2026-04-26

### 1.1 — Initial commit
**Time:** 2026-04-26 23:15  
**Type:** requirement  
**Prompt:** *(project initialised)*  
**Activity:** Scaffolded Expo/React Native project with file-based routing.  
**Outcome:** Commit `35e609f` — repo created.

---

## Session 2 — 2026-04-27

### 2.1 — Core app build
**Time:** 2026-04-27 10:36  
**Type:** requirement  
**Prompt:** Build a personal movie and TV show tracker — three lists (Watchlist, Watching, Watched), TMDB metadata, poster grid, detail screens, themes, sort order, settings.  
**Activity:** Built full app: WatchlistContext, ThemeContext, TMDB hooks, movie/TV detail screens, search with trending, grid/list view, sort persistence, light/dark/system themes.  
**Outcome:** Commits `feedaa6`, `55eebdc` — working app with user-provided TMDB API key and onboarding flow.

---

## Session 3 — 2026-04-30

### 3.1 — Streaming providers, recommendations, reviews, Quick Actions
**Time:** 2026-04-30 21:04  
**Type:** requirement  
**Prompt:** Add streaming providers (JustWatch via TMDB), recommendations row, personal review field, settings toggles for each section, and iOS Quick Actions.  
**Activity:** Added `useWatchProviders`, `StreamingProviders`, `RecommendationsRow`, `ReviewInput`, `SettingsContext` with toggles; wired iOS Quick Actions with Expo Go fallback guard.  
**Outcome:** Commits `f590202`, `e0427d1`.

### 3.2 — Internationalisation
**Time:** 2026-04-30 21:24  
**Type:** requirement  
**Prompt:** Add i18n support — English and German, auto device-language detection, TMDB content language follows the selection.  
**Activity:** Integrated i18next + expo-localization; created `en.json`, `de.json`; added language picker in Settings as a bottom sheet; set up Weblate config for community translations.  
**Outcome:** Commits `4509a89`, `1569352`, `7c494f2`, `04bb44d`.

### 3.3 — Spanish via Weblate
**Time:** 2026-04-30 22:59  
**Type:** experience  
**Prompt:** *(Weblate contributor added Spanish translation)*  
**Activity:** Merged Weblate PR; wired `es` locale into `SUPPORTED`, `LANG_OPTIONS`, `translationCoverage`; added translation completion % badge in language picker with Weblate link.  
**Outcome:** Commits `0a85dc0`, `8f36639`, `dc45b69`, `04af768`, `d14c78a`.

### 3.4 — README
**Time:** 2026-04-30 22:35  
**Type:** requirement  
**Prompt:** Add a proper README covering features, setup, structure, and contribution guide.  
**Activity:** Wrote full README with feature list, getting-started guide, project structure, translation workflow, and tech-stack table.  
**Outcome:** Commit `73d46e9`.

### 3.5 — MIT licence & Weblate eligibility
**Time:** 2026-04-30 22:09  
**Type:** requirement  
**Prompt:** Add MIT licence so the project qualifies for Weblate free hosting.  
**Activity:** Added `LICENSE` file, removed TMDB key from `eas.json`, updated README badge.  
**Outcome:** Commits `29234f8`, `872bd23`.

---

## Session 4 — 2026-05-01

### 4.1 — iOS CI/CD pipeline
**Time:** 2026-05-01 17:42  
**Type:** requirement  
**Prompt:** Set up GitHub Actions workflows for automated EAS builds and App Store / TestFlight submission.  
**Activity:** Created `ios-build.yml` (alpha/beta/production) and `ios-release.yml`; configured `eas.json` with auto-increment and EAS submit profiles using secrets for ASC credentials.  
**Outcome:** Commits `b024cba`, `8d3a4ad`, `2112fcb`.

### 4.2 — App Store metadata & privacy policy
**Time:** 2026-05-01 19:13  
**Type:** requirement  
**Prompt:** Add App Store metadata and a public privacy policy page for Apple review.  
**Activity:** Added ASC metadata files; created GitHub Pages privacy policy site.  
**Outcome:** Commit `24536eb`.

---

## Session 5 — 2026-05-03 (morning/afternoon)

### 5.1 — Episode Guide
**Time:** ~2026-05-03 11:00  
**Type:** requirement  
**Prompt:** *(continued from previous session)* Fix season/episode steppers to respect actual episode counts; add a horizontal episode browser with TMDB stills, names, and summaries; auto-scroll to the currently watching episode on screen open.  
**Activity:** Added `useTVSeason` hook; built horizontal FlatList episode browser with season pill selector; implemented `seasonSyncedRef` pattern for one-time sync; highlighted current episode with accent border; auto-scroll on data load.  
**Outcome:** Part of commit `82078a4`.

### 5.2 — Episode Guide settings toggle
**Time:** ~2026-05-03 11:30  
**Type:** requirement  
**Prompt:** Add a settings toggle to show/hide the new Episode Guide section. Call it "Episode Guide".  
**Activity:** Added `showEpisodeGuide` to `SettingsContext`; added toggle row in `settings.tsx` with `list-outline` icon; added i18n keys to all three locales.  
**Outcome:** Part of commit `82078a4`.

### 5.3 — Episode detail modal
**Time:** ~2026-05-03 12:00  
**Type:** requirement  
**Prompt:** Add a detail popup for a tapped episode — consistent with the TrailerModal, showing full still, air date, TMDB rating, and complete overview.  
**Activity:** Created `EpisodeModal.tsx` as a bottom sheet; used `animationType="none"` with manual `Animated.Value` entry/exit; displayed S{n}E{n} header, w780 still, air date chip, rating chip, and full overview.  
**Outcome:** Part of commit `82078a4`.

### 5.4 — Swipe-to-dismiss on modals
**Time:** ~2026-05-03 12:30  
**Type:** requirement  
**Prompt:** Both TrailerModal and EpisodeModal should support pulling down on the handle to close.  
**Activity:** Created `useSwipeToDismiss` hook using `PanResponder` with `onStartShouldSetPanResponder: true`; fixed spring overshoot (underdamped), touch conflict with `Pressable` (switched to `Animated.View`), and dismiss flicker (moved `dragY` reset to next open cycle); applied to both modals.  
**Outcome:** Part of commit `82078a4`.

### 5.5 — Profile animation & About section
**Time:** ~2026-05-03 13:00  
**Type:** requirement  
**Prompt:** *(included in same session)* Animate the profile stats; add an About section to Settings with TMDB and YouTube attribution.  
**Activity:** Added entry animation to profile stats; added `AboutSection` component with BlueSky logo, TMDB gradient badge, and YouTube logo.  
**Outcome:** Commit `82078a4` — first TestFlight alpha triggered.

### 5.6 — Age rating badges
**Time:** 2026-05-03 17:32  
**Type:** idea  
**Prompt:** I noticed that the TV show and movie detail listings miss age ratings. I guess we should add them.  
**Activity:** Added `TMDBReleaseDates`, `TMDBContentRatings` types; added `getMovieReleaseDates`, `getTVContentRatings` to `tmdb` object; created `useContentRating` hook with device-region detection and US fallback; displayed a small bordered pill badge in the `metaRow` of both detail screens.  
**Outcome:** Commit `2408fb4` — second TestFlight alpha triggered.

---

## Session 6 — 2026-05-03 (evening)

### 6.1 — Weblate push failure
**Time:** ~2026-05-03 21:40  
**Type:** bug  
**Prompt:** A Weblate contributor added Estonian translations but the push to the repo fails with a non-fast-forward error.  
**Activity:** Diagnosed stale remote `weblate` branch diverged from `main` due to direct commits; deleted the remote `weblate` branch so Weblate could push a fresh rebased branch.  
**Outcome:** Weblate push succeeded; PR created and merged — commits `576e66e`–`6e0bd26`.

### 6.2 — Wire Estonian language
**Time:** 2026-05-03 21:58  
**Type:** requirement  
**Prompt:** Yes, please. (after asking whether to wire up the Estonian locale)  
**Activity:** Pulled latest; added `et` to `SUPPORTED`, i18n resources, `translationCoverage`, and `LANG_OPTIONS`; added `"langEstonian"` display name strings to `en.json` and `de.json`; updated README.  
**Outcome:** Commit `c2ea32f` — third TestFlight alpha triggered.

### 6.3 — i18n fallback broken for partial locales
**Time:** 2026-05-03 22:45  
**Type:** bug  
**Prompt:** When switching the language to Spanish, most of the UI is empty. Also, the completion percentage after "Spanish" is missing although it's really low.  
**Activity:** Identified root cause: empty strings `""` in translation files counted as valid translations, so i18next returned them instead of falling back to English, and `countLeaves` counted them inflating coverage to ~100%. Added `returnEmptyString: false` to i18next init; updated `countLeaves` to skip empty strings.  
**Outcome:** Commit `7742f03`.

### 6.4 — Tab header wraps to two lines in Spanish
**Time:** 2026-05-03 22:49  
**Type:** experience  
**Prompt:** The main page tab headers look broken in Spanish — "Lista de seguimiento" wraps to two lines and the badge floats in the middle.  
**Activity:** First switched tab to `flexDirection: 'column'` (badge below label). User preferred the original badge-right layout but wanted bottom alignment. Changed `alignItems` to `flex-end` on both `tabRow` and `tab` so all tabs share the same bottom baseline regardless of label height.  
**Outcome:** Commits `b8ab07f`, `89b93a7`.

### 6.5 — Theme song feature (explored then dropped)
**Time:** ~2026-05-03 23:00  
**Type:** idea  
**Prompt:** Is it possible to make it so that the user could play the theme song of a movie or show?  
**Activity:** Created `feature/theme-song` branch; implemented iTunes Search API hook (`useThemeSong`), `ThemePlayer` component with `expo-audio`, animated progress bar, settings toggle, and media-type-aware search scoring. Iterated on: search accuracy, smooth animation, crash on unmount (`player.remove()` double-free), and TV vs movie disambiguation. After multiple iterations still returned wrong songs for some titles (e.g. "The Rookie" TV show returned 2002 film OST due to iTunes having no structured show→song mapping).  
**Activity (resolution):** Concluded the iTunes Search API is fundamentally keyword-based with no structured show-to-theme relationship; MusicBrainz two-step approach would be needed for reliability. User decided against it.  
**Outcome:** Branch `feature/theme-song` deleted; `main` unchanged.

---

## Session 7 — 2026-05-04

### 7.1 — Episode guide shows wrong season data on open
**Time:** 2026-05-04 09:15  
**Type:** bug  
**Prompt:** The episode guide opens on Season 3 Episode 4 for Star Trek SNW but shows Episode 4 of Season 1 instead. Only after switching seasons does the correct episode appear.  
**Activity:** Identified race condition in `useTVSeason`: component mounts with `selectedSeason = 1`, fires a Season 1 fetch, watchlist then hydrates and bumps to Season 3 — but the in-flight Season 1 response arrives and overwrites the data before Season 3 loads, causing the auto-scroll to target Season 1 episodes. Added `cancelled` cleanup flag so stale responses are discarded.  
**Outcome:** Commit `6469613`.

### 7.2 — Default to Watching tab on launch
**Time:** 2026-05-04 09:20  
**Type:** idea  
**Prompt:** I guess it makes sense to always start the app with the "Watching" area being selected first.  
**Activity:** Changed `useState<WatchStatus>('watchlist')` to `'watching'` in `index.tsx`.  
**Outcome:** Commit `9288f2b` — fourth TestFlight alpha triggered.

### 7.3 — Age rating should follow app language, not device locale
**Time:** 2026-05-04 17:25  
**Type:** requirement  
**Prompt:** The age rating differs from country to country. I'd suggest making it depend on the chosen language instead.  
**Activity:** Added `LANG_TO_REGION` mapping (`en→US`, `de→DE`, `es→ES`, `et→EE`) to `useTMDB.ts`; updated `useContentRating` to resolve region from the app's language setting via `useSettings` + `resolveLanguage`, falling back to device locale for unknown or system language. Re-runs when `language` setting changes.  
**Outcome:** Commit `75c53f0`.

### 7.4 — Adopt Conventional Commits
**Time:** ~2026-05-04 18:00  
**Type:** decision  
**Prompt:** I am thinking about whether it is possible to rewrite all past commit messages in this style. (referring to Conventional Commits)  
**Activity:** Explained the Conventional Commits specification (types, scopes, breaking change notation). Discussed history rewrite tradeoffs — all SHAs change, force push required, Weblate integration risk. User decided against rewriting history; agreed to adopt Conventional Commits from the next commit forward.  
**Outcome:** No code change. Standing rule saved to memory and CLAUDE.md.

### 7.5 — Persistent memory research
**Time:** ~2026-05-04 18:15  
**Type:** examination  
**Prompt:** I am thinking about creating a real persistent memory. One tool seems to be Obsidian. Another kinda new one is named Mem Palace. Please get into this, wrap things up for me and tutor me so I am able to get a deep understanding before we implement new processes and tools.  
**Activity:** Researched and explained the full landscape: context window compaction mechanics, the three memory layers (CLAUDE.md / auto memory / external systems), Obsidian + MCP plugins, MemPalace (April 2026, MIT, local ChromaDB+SQLite, verbatim storage), Mem.ai (separate category — cloud note app, not relevant), official Anthropic memory MCP server (knowledge graph, JSONL), Mem0, Zep/Graphiti. Provided trade-off matrix (local vs cloud, structured vs unstructured, automatic vs manual).  
**Outcome:** No implementation. User now has a clear picture to inform future decisions.

### 7.6 — Auto-update DEV_LOG
**Time:** ~2026-05-04 18:30  
**Type:** requirement  
**Prompt:** I would like to ask you to persist messages we exchange including any objectives and more into the DEV_LOG automatically and on your own.  
**Activity:** Added DEV_LOG auto-update rule to CLAUDE.md; saved feedback memory. Updated DEV_LOG retroactively with entries 7.4–7.6.  
**Outcome:** Process change — no commit. DEV_LOG is now a living document updated each session without prompting.

### 7.7 — iOS widget (future idea)
**Time:** ~2026-05-04 19:00  
**Type:** idea  
**Prompt:** I would like to know whether it is (a) possible to implement a widget on iOS for watcho using our chosen technology stack and if you (b) can suggest any kind of value this OS feature could be of for the user.  
**Activity:** Assessed feasibility: possible via WidgetKit + Expo config plugin, but widget UI must be Swift/SwiftUI (no React Native); data bridge via App Groups shared storage; incompatible with Expo Go, requires development builds. Identified strongest use case as a "Continue Watching" widget (poster + S·E progress, one-tap deep link). Secondary ideas: glanceable stats (Watchlist/Watching/Watched counts), "Up Next" nudge. Trending/random-pick dismissed as lower value.  
**Outcome:** Logged as future idea. Deferred until after Android pipeline — requires native Swift code and shifts build workflow.

---

## Session 8 — 2026-05-04 (evening) / 2026-05-05

### 8.1 — Status line configuration
**Time:** ~2026-05-04 19:30  
**Type:** requirement  
**Prompt:** Is it possible to alter the status line of this Claude Code client so that it shows viable information about the git status of this project?  
**Activity:** Created `~/.claude/statusline.ps1` PowerShell script; added `statusLine` block to `~/.claude/settings.json`. Debugged: backslash path mangling fixed with forward slashes; stdin blocking fixed with async 300ms timeout; Nerd Font glyph version mismatch (NF v3 vs v2 FA codepoints) fixed by switching to Powerline U+E0A0 (branch) and standard Unicode symbols (✚ ● …). Cost field removed (flat plan). Status line shows: model · git branch + staged/modified/untracked · context %.  
**Outcome:** No app commit. Config files at `~/.claude/`.

### 8.2 — App Store rejection: SFSafariViewController
**Time:** 2026-05-05  
**Type:** bug  
**Prompt:** Apple stumbled over an issue — the onboarding process opens the default web browser to retrieve a TMDB API key, which Apple flagged as a poor UX requiring in-app sign-in or SFSafariViewController.  
**Activity:** Installed `expo-web-browser`; replaced both `Linking.openURL()` calls in `onboarding.tsx` with `WebBrowser.openBrowserAsync()` (SFSafariViewController on iOS); updated button icon from `open-outline` to `globe-outline`; updated onboarding body copy in EN and DE to explicitly state "one-time developer credential, not a sign-in". Added `workflow_dispatch` trigger to `ios-release.yml` (it previously only fired on version tags). Triggered TestFlight alpha build for device testing and production build for App Store resubmission.  
**Outcome:** Commits `6283b79`, `8fbf633` — alpha + production builds triggered.

---

---

## Session 9 — 2026-05-11

### 9.1 — Backup & restore (export / import)
**Time:** 2026-05-11  
**Type:** requirement  
**Prompt:** Implement a complete data export and import feature using JSON and the iOS Share Sheet on export (user decides destination), file selection dialog on import, and the ability to share a backup file directly to watcho to trigger the import flow. Import must offer: replace-all and merge modes; merge offers three conflict strategies: keep mine, keep backup, keep newest. Localize across all languages. Bump to 1.1.0.  
**Activity:** Added `expo-document-picker`, `expo-file-system`, `expo-sharing`. Created `lib/backup.ts` with `exportWatchlist` (writes JSON to cache, triggers iOS Share Sheet), `readBackupFile`, `parseBackupJson`, and `mergeWatchlists` (supports `replace`, `merge_keep_existing`, `merge_keep_backup`, `merge_keep_newest`). Created `components/ImportModal.tsx` — bottom-sheet modal with mode selector (Replace All / Merge), conflict-resolution picker for merge mode, and a destructive-action warning when Replace is chosen. Extended `WatchlistContext` with `replaceItems`. Added `DATA` section to `settings.tsx` (Export + Import rows). Added Linking listener in `_layout.tsx` to catch incoming `file://` URLs (e.g. sharing a backup from Files or another app) and surface the ImportModal at the root level. Registered `CFBundleDocumentTypes` (public.json) in `app.json` so iOS opens watcho when the user taps a `.json` backup file. Added `expo-document-picker` to plugins. Localized all new `settings.data.*` keys: full EN + DE translations; ES + ET stubs for Weblate. Updated README with backup/restore section.  
**Outcome:** Commit — version bumped to 1.1.0.

*Log maintained continuously from 2026-05-04. Entries marked with ~ have approximate times inferred from session context; all others are anchored to git commit timestamps.*
