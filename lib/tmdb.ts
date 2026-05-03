import { TMDBContentRatings, TMDBMovie, TMDBReleaseDates, TMDBSeason, TMDBSearchResult, TMDBTVShow, WatchProviders } from '@/types';
import { getStoredApiKey } from './apiKey';

const BASE_URL = 'https://api.themoviedb.org/3';

let _language = 'en';
export function setTMDBLanguage(lang: string) { _language = lang; }

export const POSTER_URL = (path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const BACKDROP_URL = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w780${path}` : null;

export const LOGO_URL = (path: string) => `https://image.tmdb.org/t/p/w92${path}`;

async function get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = await getStoredApiKey();
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', _language);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

interface PagedResult<T> {
  results: T[];
  total_results: number;
  total_pages: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
  iso_639_1: string;
}

interface VideosResult {
  results: TMDBVideo[];
}

export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const url = new URL(`${BASE_URL}/configuration`);
    url.searchParams.set('api_key', key.trim());
    const res = await fetch(url.toString());
    return res.ok;
  } catch {
    return false;
  }
}

// Pull videos in all major languages; "null" includes language-neutral entries.
const ALL_VIDEO_LANGS = 'en,de,fr,es,it,pt,ja,ko,zh,ru,ar,tr,pl,nl,sv,da,no,fi,null';

export const tmdb = {
  searchMulti: (query: string) =>
    get<PagedResult<TMDBSearchResult>>('/search/multi', { query, include_adult: 'false' }),
  getTrending: () =>
    get<PagedResult<TMDBSearchResult>>('/trending/all/day'),
  getPopularMovies: () =>
    get<PagedResult<TMDBMovie>>('/movie/popular'),
  getPopularTV: () =>
    get<PagedResult<TMDBTVShow>>('/tv/popular'),
  getMovie: (id: number) =>
    get<TMDBMovie>(`/movie/${id}`),
  getTVShow: (id: number) =>
    get<TMDBTVShow>(`/tv/${id}`),
  getMovieVideos: (id: number) =>
    get<VideosResult>(`/movie/${id}/videos`, { include_video_language: ALL_VIDEO_LANGS }),
  getTVVideos: (id: number) =>
    get<VideosResult>(`/tv/${id}/videos`, { include_video_language: ALL_VIDEO_LANGS }),
  getTVSeasonVideos: (showId: number, season: number) =>
    get<VideosResult>(`/tv/${showId}/season/${season}/videos`, { include_video_language: ALL_VIDEO_LANGS }),
  getTVSeason: (showId: number, season: number) =>
    get<TMDBSeason>(`/tv/${showId}/season/${season}`),
  getMovieReleaseDates: (id: number) =>
    get<TMDBReleaseDates>(`/movie/${id}/release_dates`),
  getTVContentRatings: (id: number) =>
    get<TMDBContentRatings>(`/tv/${id}/content_ratings`),
  getMovieProviders: (id: number) =>
    get<{ results: Record<string, WatchProviders> }>(`/movie/${id}/watch/providers`),
  getTVProviders: (id: number) =>
    get<{ results: Record<string, WatchProviders> }>(`/tv/${id}/watch/providers`),
  getMovieRecommendations: (id: number) =>
    get<PagedResult<TMDBSearchResult>>(`/movie/${id}/recommendations`),
  getTVRecommendations: (id: number) =>
    get<PagedResult<TMDBSearchResult>>(`/tv/${id}/recommendations`),
};
