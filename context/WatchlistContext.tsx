import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { loadWatchlist, persistWatchlist } from '@/lib/storage';
import { MediaItem, MediaType, WatchStatus, WatchlistStats } from '@/types';

interface State {
  items: MediaItem[];
  loaded: boolean;
}

type Action =
  | { type: 'LOAD'; items: MediaItem[] }
  | { type: 'ADD'; item: MediaItem }
  | { type: 'REMOVE'; id: number; mediaType: MediaType }
  | { type: 'UPDATE_STATUS'; id: number; mediaType: MediaType; status: WatchStatus }
  | { type: 'UPDATE_RATING'; id: number; mediaType: MediaType; rating: number }
  | { type: 'UPDATE_PROGRESS'; id: number; season: number; episode: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { items: action.items, loaded: true };
    case 'ADD':
      return { ...state, items: [action.item, ...state.items] };
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.mediaType === action.mediaType)
        ),
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.mediaType === action.mediaType
            ? { ...i, status: action.status }
            : i
        ),
      };
    case 'UPDATE_RATING':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.mediaType === action.mediaType
            ? { ...i, userRating: action.rating }
            : i
        ),
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.mediaType === 'tv'
            ? { ...i, currentSeason: action.season, currentEpisode: action.episode }
            : i
        ),
      };
    default:
      return state;
  }
}

interface WatchlistContextValue {
  items: MediaItem[];
  loaded: boolean;
  getItem: (id: number, mediaType: MediaType) => MediaItem | undefined;
  addItem: (item: Omit<MediaItem, 'addedAt'>) => void;
  removeItem: (id: number, mediaType: MediaType) => void;
  updateStatus: (id: number, mediaType: MediaType, status: WatchStatus) => void;
  updateRating: (id: number, mediaType: MediaType, rating: number) => void;
  updateProgress: (id: number, season: number, episode: number) => void;
  stats: WatchlistStats;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], loaded: false });

  useEffect(() => {
    loadWatchlist().then((items) => dispatch({ type: 'LOAD', items }));
  }, []);

  useEffect(() => {
    if (state.loaded) {
      persistWatchlist(state.items);
    }
  }, [state.items, state.loaded]);

  const getItem = useCallback(
    (id: number, mediaType: MediaType) =>
      state.items.find((i) => i.id === id && i.mediaType === mediaType),
    [state.items]
  );

  const addItem = useCallback((item: Omit<MediaItem, 'addedAt'>) => {
    dispatch({ type: 'ADD', item: { ...item, addedAt: new Date().toISOString() } });
  }, []);

  const removeItem = useCallback((id: number, mediaType: MediaType) => {
    dispatch({ type: 'REMOVE', id, mediaType });
  }, []);

  const updateStatus = useCallback((id: number, mediaType: MediaType, status: WatchStatus) => {
    dispatch({ type: 'UPDATE_STATUS', id, mediaType, status });
  }, []);

  const updateRating = useCallback((id: number, mediaType: MediaType, rating: number) => {
    dispatch({ type: 'UPDATE_RATING', id, mediaType, rating });
  }, []);

  const updateProgress = useCallback((id: number, season: number, episode: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', id, season, episode });
  }, []);

  const stats: WatchlistStats = React.useMemo(() => {
    const watched = state.items.filter((i) => i.status === 'watched');
    const watching = state.items.filter((i) => i.status === 'watching');
    const watchlist = state.items.filter((i) => i.status === 'watchlist');
    const rated = watched.filter((i) => i.userRating !== undefined);
    const avgRating =
      rated.length > 0
        ? rated.reduce((sum, i) => sum + (i.userRating ?? 0), 0) / rated.length
        : 0;

    const genreMap = new Map<string, number>();
    for (const item of watched) {
      for (const g of item.genres) {
        genreMap.set(g.name, (genreMap.get(g.name) ?? 0) + 1);
      }
    }
    const topGenres = Array.from(genreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalWatched: watched.length,
      totalWatching: watching.length,
      totalWatchlist: watchlist.length,
      averageRating: Math.round(avgRating * 10) / 10,
      topGenres,
    };
  }, [state.items]);

  return (
    <WatchlistContext.Provider
      value={{ items: state.items, loaded: state.loaded, getItem, addItem, removeItem, updateStatus, updateRating, updateProgress, stats }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
