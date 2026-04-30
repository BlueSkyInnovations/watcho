import { useEffect, useMemo, useRef, useState } from 'react';
import * as QuickActions from 'expo-quick-actions';
import type { Action } from 'expo-quick-actions';
import { router } from 'expo-router';
import { useWatchlist } from '@/context/WatchlistContext';

export function useQuickActions() {
  const { items, loaded, updateProgress } = useWatchlist();
  const [toast, setToast] = useState<string | null>(null);

  // Keep a ref so the listener always reads fresh items without re-registering
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // Most recently updated TV show in 'watching' status
  const latestShow = useMemo(() => {
    return [...items]
      .filter((i) => i.mediaType === 'tv' && i.status === 'watching')
      .sort((a, b) =>
        (b.updatedAt ?? b.addedAt).localeCompare(a.updatedAt ?? a.addedAt)
      )[0] ?? null;
  }, [items]);

  // Keep the quick action subtitle in sync with current episode
  useEffect(() => {
    if (!loaded) return;
    if (!latestShow) {
      QuickActions.setItems([]);
      return;
    }
    const s = latestShow.currentSeason ?? 1;
    const e = latestShow.currentEpisode ?? 1;
    QuickActions.setItems([
      {
        id: 'next-episode',
        title: '+1 Episode',
        subtitle: `${latestShow.title} · S${s} E${e}`,
        icon: 'symbol:play.fill',
        params: { showId: latestShow.id },
      },
      {
        id: 'open-show',
        title: 'Continue Watching',
        subtitle: latestShow.title,
        icon: 'symbol:tv.fill',
        params: { showId: latestShow.id },
      },
    ]);
  }, [latestShow, loaded]);

  function handleAction(action: Action) {
    const showId = Number(action.params?.showId);
    if (!showId) return;

    if (action.id === 'open-show') {
      router.push(`/tv/${showId}`);
      return;
    }

    if (action.id === 'next-episode') {
      const show = itemsRef.current.find((i) => i.id === showId && i.mediaType === 'tv');
      if (!show) return;
      const season = show.currentSeason ?? 1;
      const nextEp = (show.currentEpisode ?? 1) + 1;
      updateProgress(showId, season, nextEp);
      setToast(`${show.title} · S${season} E${nextEp} marked`);
    }
  }

  // Cold start: app was launched via the quick action
  const handledInitial = useRef(false);
  useEffect(() => {
    if (!loaded || handledInitial.current) return;
    handledInitial.current = true;
    if (QuickActions.initial) handleAction(QuickActions.initial);
  }, [loaded]);

  // Foreground: quick action while app is already running
  useEffect(() => {
    const sub = QuickActions.addListener(handleAction);
    return () => sub.remove();
  }, []);

  return { toast, clearToast: () => setToast(null) };
}
