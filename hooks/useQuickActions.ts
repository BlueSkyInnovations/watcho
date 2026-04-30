import { useEffect, useMemo, useRef, useState } from 'react';
import * as QuickActions from 'expo-quick-actions';
import type { Action } from 'expo-quick-actions';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWatchlist } from '@/context/WatchlistContext';

export function useQuickActions() {
  const { items, loaded, updateProgress } = useWatchlist();
  const { t } = useTranslation();
  const [toast, setToast] = useState<string | null>(null);

  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  const latestShow = useMemo(() => {
    return [...items]
      .filter((i) => i.mediaType === 'tv' && i.status === 'watching')
      .sort((a, b) =>
        (b.updatedAt ?? b.addedAt).localeCompare(a.updatedAt ?? a.addedAt)
      )[0] ?? null;
  }, [items]);

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
        title: t('quickActions.nextEpisode'),
        subtitle: `${latestShow.title} · S${s} E${e}`,
        icon: 'symbol:play.fill',
        params: { showId: latestShow.id },
      },
      {
        id: 'open-show',
        title: t('quickActions.continueWatching'),
        subtitle: latestShow.title,
        icon: 'symbol:tv.fill',
        params: { showId: latestShow.id },
      },
    ]);
  }, [latestShow, loaded, t]);

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
      setToast(t('quickActions.markedToast', { title: show.title, season, episode: nextEp }));
    }
  }

  const handledInitial = useRef(false);
  useEffect(() => {
    if (!loaded || handledInitial.current) return;
    handledInitial.current = true;
    if (QuickActions.initial) handleAction(QuickActions.initial);
  }, [loaded]);

  useEffect(() => {
    const sub = QuickActions.addListener(handleAction);
    return () => sub.remove();
  }, []);

  return { toast, clearToast: () => setToast(null) };
}
