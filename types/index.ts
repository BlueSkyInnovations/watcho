export type WatchStatus = 'watchlist' | 'watching' | 'watched';
export type MediaType = 'movie' | 'tv';

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
  userRating?: number;
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

export interface WatchlistStats {
  totalWatched: number;
  totalWatching: number;
  totalWatchlist: number;
  averageRating: number;
  topGenres: { name: string; count: number }[];
}
