import { useEffect, useRef, useState } from 'react';
import { tmdb } from '@/lib/tmdb';
import { TMDBMovie, TMDBSeason, TMDBSearchResult, TMDBTVShow, WatchProviders } from '@/types';
import type { MediaType } from '@/types';
import type { TMDBVideo } from '@/lib/tmdb';

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

export function useVideos(mediaType: MediaType, id: number) {
  const [videos, setVideos] = useState<TMDBVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = mediaType === 'movie' ? tmdb.getMovieVideos : tmdb.getTVVideos;
    fetch(id)
      .then((data) => setVideos(data.results.filter((v) => v.site === 'YouTube')))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  return { videos, loading };
}

function getDeviceRegion(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const parts = locale.split('-');
    const last = parts[parts.length - 1].toUpperCase();
    return /^[A-Z]{2}$/.test(last) ? last : 'US';
  } catch {
    return 'US';
  }
}

export function useWatchProviders(mediaType: MediaType, id: number) {
  const [providers, setProviders] = useState<WatchProviders | null>(null);
  const [region, setRegion] = useState('US');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectedRegion = getDeviceRegion();
    setRegion(detectedRegion);
    const fn = mediaType === 'movie' ? tmdb.getMovieProviders : tmdb.getTVProviders;
    fn(id)
      .then((data) => {
        setProviders(data.results[detectedRegion] ?? data.results['US'] ?? null);
      })
      .catch(() => setProviders(null))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  return { providers, region, loading };
}

export function useRecommendations(mediaType: MediaType, id: number) {
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fn = mediaType === 'movie' ? tmdb.getMovieRecommendations : tmdb.getTVRecommendations;
    fn(id)
      .then((data) => setResults(data.results.slice(0, 15)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [mediaType, id]);

  return { results, loading };
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

export function useContentRating(mediaType: MediaType, id: number) {
  const [rating, setRating] = useState<string | null>(null);

  useEffect(() => {
    const region = getDeviceRegion();

    if (mediaType === 'movie') {
      tmdb.getMovieReleaseDates(id)
        .then((data) => {
          const entry = data.results.find((r) => r.iso_3166_1 === region)
            ?? data.results.find((r) => r.iso_3166_1 === 'US');
          if (!entry) return;
          const cert = entry.release_dates.find((d) => d.type === 3 && d.certification)
            ?? entry.release_dates.find((d) => d.certification);
          if (cert?.certification) setRating(cert.certification);
        })
        .catch(() => {});
    } else {
      tmdb.getTVContentRatings(id)
        .then((data) => {
          const entry = data.results.find((r) => r.iso_3166_1 === region)
            ?? data.results.find((r) => r.iso_3166_1 === 'US');
          if (entry?.rating) setRating(entry.rating);
        })
        .catch(() => {});
    }
  }, [mediaType, id]);

  return rating;
}

export function useTVSeason(showId: number, season: number) {
  const [data, setData] = useState<TMDBSeason | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showId || season < 1) return;
    setLoading(true);
    setData(null);
    tmdb.getTVSeason(showId, season)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [showId, season]);

  return { data, loading };
}
