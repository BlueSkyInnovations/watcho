# testID Conventions — watcho

All interactive and assertable elements carry a `testID` prop for Maestro E2E tests.

## Naming pattern

```
{namespace}:{element}[:{qualifier}]
```

- **namespace** — screen or component name in kebab-case  
- **element** — role + short description in kebab-case  
- **qualifier** — optional variant (status slug, number, option key)

Colons are the only separator. No spaces, no camelCase, no underscores.

## Namespaces and IDs

### Screens

| Namespace | Screen file |
|---|---|
| `onboarding` | `app/onboarding.tsx` |
| `my-lists` | `app/(home)/index.tsx` |
| `profile` | `app/(home)/_layout.tsx` (settings btn) |
| `movie-detail` | `app/movie/[id].tsx` |
| `tv-detail` | `app/tv/[id].tsx` |
| `settings` | `app/settings.tsx` + inline `LanguageSheet` |

### Components

| Namespace | Component file |
|---|---|
| `search-bar` | `components/SearchBar.tsx` |
| `status-selector` | `components/StatusSelector.tsx` |
| `rating-stars` | `components/RatingStars.tsx` |
| `sort-sheet` | `components/SortSheet.tsx` |
| `review-input` | `components/ReviewInput.tsx` |
| `import-modal` | `components/ImportModal.tsx` |
| `episode-modal` | `components/EpisodeModal.tsx` |
| `toast` | `components/Toast.tsx` |

## Full ID reference

### `onboarding`
| ID | Element |
|---|---|
| `onboarding:btn-create-account` | "Create TMDB Account" button |
| `onboarding:btn-go-to-api` | "Go to TMDB API Settings" button |
| `onboarding:btn-have-key` | "I already have a key" button |
| `onboarding:btn-back` | Back chevron in enter-key step |
| `onboarding:input-api-key` | API key TextInput |
| `onboarding:error-message` | Error row (container + text) |
| `onboarding:btn-submit` | "Verify & Continue" button |

### `my-lists`
| ID | Element |
|---|---|
| `my-lists:tab-watchlist` | Watchlist tab Pressable |
| `my-lists:tab-watching` | Watching tab Pressable |
| `my-lists:tab-watched` | Watched tab Pressable |
| `my-lists:count-watchlist` | Watchlist count badge View |
| `my-lists:count-watching` | Watching count badge View |
| `my-lists:count-watched` | Watched count badge View |
| `my-lists:btn-toggle-view` | Grid/list toggle Pressable |
| `my-lists:btn-sort` | Sort order Pressable |

### `profile`
| ID | Element |
|---|---|
| `profile:btn-settings` | Settings gear icon Pressable in Profile tab header |

### `media-card`
Dynamic — testID is generated from the item's title at render time.

| Pattern | Element |
|---|---|
| `media-card:{title}` | The tappable `Pressable` root of `MediaCard` |

Examples: `media-card:Inception`, `media-card:Breaking Bad`.  
Use this in flows instead of `tapOn: "Title"` to avoid ambiguity with the search bar input, which also displays the typed text.

### `search-bar`
| ID | Element |
|---|---|
| `search-bar:input` | Search TextInput |
| `search-bar:btn-clear` | Clear (×) Pressable |

### `search` (screen-level, added to `search.tsx`)
| ID | Element |
|---|---|
| `search:trending-heading` | "Trending Today" Text |

### `sort-sheet`
| ID | Element |
|---|---|
| `sort-sheet:option-added-at` | "Date Added" row |
| `sort-sheet:option-release-date` | "Release Date" row |
| `sort-sheet:option-updated-at` | "Last Updated" row |

### `status-selector`
| ID | Element |
|---|---|
| `status-selector:btn-watchlist` | Watchlist button |
| `status-selector:btn-watching` | Watching button |
| `status-selector:btn-watched` | Watched button |

### `rating-stars`
| ID | Element |
|---|---|
| `rating-stars:star-1` … `rating-stars:star-5` | Individual star Pressables |

### `review-input`
| ID | Element |
|---|---|
| `review-input:input` | Multi-line TextInput |

### `movie-detail`
| ID | Element |
|---|---|
| `movie-detail:back-btn` | Back chevron Pressable |
| `movie-detail:btn-trailer` | "Watch Trailer(s)" Pressable |
| `movie-detail:btn-remove` | "Remove from lists" Pressable |

### `tv-detail`
| ID | Element |
|---|---|
| `tv-detail:back-btn` | Back chevron Pressable |
| `tv-detail:btn-trailer` | "Watch Trailer(s)" Pressable |
| `tv-detail:season-minus` | Season decrement Pressable |
| `tv-detail:season-value` | Season number Text |
| `tv-detail:season-plus` | Season increment Pressable |
| `tv-detail:episode-minus` | Episode decrement Pressable |
| `tv-detail:episode-value` | Episode number Text |
| `tv-detail:episode-plus` | Episode increment Pressable |
| `tv-detail:season-pill-{n}` | Season selector pill (n = season number) |
| `tv-detail:episode-card-{n}` | Episode card (n = episode number) |
| `tv-detail:btn-remove` | "Remove from lists" Pressable |

### `settings`
| ID | Element |
|---|---|
| `settings:btn-theme-light` | Light theme row Pressable |
| `settings:btn-theme-dark` | Dark theme row Pressable |
| `settings:btn-theme-system` | System theme row Pressable |
| `settings:switch-where-to-watch` | Where to Watch Switch |
| `settings:switch-more-like-this` | More Like This Switch |
| `settings:switch-review` | Personal Review Switch |
| `settings:switch-episode-guide` | Episode Guide Switch |
| `settings:btn-change-key` | Change Key Pressable |
| `settings:btn-remove-key` | Remove Key Pressable |
| `settings:btn-export` | Export Watchlist Pressable |
| `settings:btn-import` | Import Backup Pressable |
| `settings:btn-language` | App Language Pressable |
| `lang-sheet:option-system` | System language option |
| `lang-sheet:option-en` | English language option |
| `lang-sheet:option-de` | German language option |
| `lang-sheet:option-es` | Spanish language option |
| `lang-sheet:option-et` | Estonian language option |

### `import-modal`
| ID | Element |
|---|---|
| `import-modal:btn-mode-replace` | "Replace All" mode Pressable |
| `import-modal:btn-mode-merge` | "Merge" mode Pressable |
| `import-modal:btn-conflict-keep-existing` | "Keep mine" conflict option |
| `import-modal:btn-conflict-keep-backup` | "Keep backup" conflict option |
| `import-modal:btn-conflict-keep-newest` | "Keep newest" conflict option |
| `import-modal:warning` | Replace warning View |
| `import-modal:btn-cancel` | Cancel Pressable |
| `import-modal:btn-confirm` | Import/Confirm Pressable |

### `episode-modal`
| ID | Element |
|---|---|
| `episode-modal:btn-close` | Close × Pressable |

### `toast`
| ID | Element |
|---|---|
| `toast:container` | Toast Animated.View |
