import { TMDBMovie, TMDBSearchResult, TMDBTVShow } from '@/types';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '';

export const POSTER_URL = (path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const BACKDROP_URL = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w780${path}` : null;

async function get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
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
};
