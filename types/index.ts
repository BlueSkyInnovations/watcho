export type WatchStatus = 'watchlist' | 'watching' | 'watched';
export type MediaType = 'movie' | 'tv';
export type SortOrder = 'release_date' | 'added_at' | 'updated_at';

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  genres: { id: number; name: string }[];
  status: WatchStatus;
  addedAt: string;
  updatedAt?: string;
  userRating?: number;
  review?: string;
  // TV only
  numberOfSeasons?: number;
  currentSeason?: number;
  currentEpisode?: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  episode_run_time?: number[];
}

export interface TMDBSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
  air_date: string;
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  episode_count: number;
  episodes: TMDBEpisode[];
}

export interface TMDBReleaseDateEntry {
  certification: string;
  release_date: string;
  type: number; // 3 = theatrical
}

export interface TMDBReleaseDates {
  results: { iso_3166_1: string; release_dates: TMDBReleaseDateEntry[] }[];
}

export interface TMDBContentRatings {
  results: { iso_3166_1: string; rating: string }[];
}

export interface WatchlistStats {
  totalWatched: number;
  totalWatching: number;
  totalWatchlist: number;
  averageRating: number;
  topGenres: { name: string; count: number }[];
}
