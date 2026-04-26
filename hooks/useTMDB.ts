import { useEffect, useRef, useState } from 'react';
import { tmdb } from '@/lib/tmdb';
import { TMDBMovie, TMDBSearchResult, TMDBTVShow } from '@/types';

export function useSearch(query: string) {
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tmdb.searchMulti(query);
        setResults(data.results.filter((r) => r.media_type !== 'person'));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return { results, loading, error };
}

export function useTrending() {
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdb.getTrending()
      .then((d) => setResults(d.results.filter((r) => r.media_type !== 'person')))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  return { results, loading };
}

export function useMovieDetail(id: number) {
  const [movie, setMovie] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tmdb.getMovie(id)
      .then(setMovie)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, loading, error };
}

export function useTVDetail(id: number) {
  const [show, setShow] = useState<TMDBTVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tmdb.getTVShow(id)
      .then(setShow)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  return { show, loading, error };
}
