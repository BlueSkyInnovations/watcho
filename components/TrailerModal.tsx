import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useColors } from '@/hooks/useColors';
import { tmdb, TMDBVideo } from '@/lib/tmdb';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  mediaType: 'movie' | 'tv';
  mediaId: number;
  initialVideos: TMDBVideo[];
  numberOfSeasons?: number;
}

type SeasonKey = 'show' | number;

const TYPE_ORDER: Record<string, number> = {
  Trailer: 0, Teaser: 1, Clip: 2, Featurette: 3, 'Behind the Scenes': 4, Bloopers: 5,
};

function sorted(videos: TMDBVideo[]) {
  return [...videos].sort((a, b) => {
    if (a.official !== b.official) return a.official ? -1 : 1;
    return (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9);
  });
}

function pickBest(videos: TMDBVideo[]) {
  const s = sorted(videos);
  return s.find((v) => v.type === 'Trailer') ?? s[0] ?? null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function badgeColors(type: string, colors: ReturnType<typeof useColors>) {
  if (type === 'Trailer') return { bg: colors.accentDim, text: colors.accent };
  if (type === 'Teaser') return { bg: 'rgba(245,197,24,0.15)', text: colors.gold };
  return { bg: colors.surfaceHighlight, text: colors.textDim };
}

function MarqueeText({ text, style, active }: { text: string; style: StyleProp<TextStyle>; active: boolean }) {
  const animX = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const [containerW, setContainerW] = useState(0);
  const [textW, setTextW] = useState(0);

  const shouldScroll = active && textW > containerW + 4;

  useEffect(() => {
    animRef.current?.stop();
    animX.setValue(0);
    if (!shouldScroll) return;

    const dist = textW - containerW;
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(animX, { toValue: -dist, duration: Math.max(dist * 30, 1500), useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(animX, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    );
    animRef.current.start();
    return () => animRef.current?.stop();
  }, [shouldScroll, textW, containerW]);

  return (
    <View style={{ flex: 1 }}>
      {/*
        Explicit width:2000 forces Yoga to allocate space beyond the container so
        the text renders at its natural single-line width. onTextLayout gives us
        the actual first-line width before any truncation.
      */}
      <Text
        style={[style, { position: 'absolute', width: 2000, top: -9999, opacity: 0 }]}
        numberOfLines={1}
        onTextLayout={(e) => {
          const line = e.nativeEvent.lines[0];
          if (line) setTextW(line.width);
        }}
      >
        {text}
      </Text>
      <View
        style={{ flex: 1, overflow: 'hidden' }}
        onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
      >
        <Animated.Text
          style={[
            style,
            { transform: [{ translateX: animX }] },
            shouldScroll ? { width: textW + 4 } : null,
          ]}
          numberOfLines={1}
          ellipsizeMode={shouldScroll ? 'clip' : 'tail'}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}


export function TrailerModal({
  visible, onClose, title, mediaType, mediaId, initialVideos, numberOfSeasons,
}: Props) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [activeSeason, setActiveSeason] = useState<SeasonKey>('show');
  const [seasonVideos, setSeasonVideos] = useState<TMDBVideo[]>([]);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string | null>(null);

  const displayedVideos = activeSeason === 'show'
    ? sorted(initialVideos)
    : sorted(seasonVideos);

  useEffect(() => {
    if (!visible) return;
    setActiveSeason('show');
    setSeasonVideos([]);
    setLangFilter(null);
    setSelectedKey(pickBest(initialVideos)?.key ?? null);
  }, [visible]);

  useEffect(() => {
    if (activeSeason === 'show' || !visible) return;
    setLoadingSeason(true);
    setSelectedKey(null);
    tmdb.getTVSeasonVideos(mediaId, activeSeason as number)
      .then((data) => {
        const vids = data.results.filter((v) => v.site === 'YouTube');
        setSeasonVideos(vids);
        setSelectedKey(pickBest(vids)?.key ?? null);
      })
      .catch(() => setSeasonVideos([]))
      .finally(() => setLoadingSeason(false));
    setLangFilter(null);
  }, [activeSeason, visible]);

  const seasons = numberOfSeasons
    ? Array.from({ length: numberOfSeasons }, (_, i) => i + 1)
    : [];

  const availableLangs = useMemo(() => {
    const langs = [...new Set(displayedVideos.map((v) => v.iso_639_1).filter(Boolean))];
    return langs.sort();
  }, [displayedVideos]);

  const filteredVideos = langFilter
    ? displayedVideos.filter((v) => v.iso_639_1 === langFilter)
    : displayedVideos;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => {/* absorb taps so backdrop doesn't close */}}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textDim} />
            </Pressable>
          </View>

          {mediaType === 'tv' && seasons.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.seasonScroll}
              contentContainerStyle={styles.seasonBar}
            >
              {(['show', ...seasons] as SeasonKey[]).map((s) => {
                const active = activeSeason === s;
                const label = s === 'show' ? 'Show' : `S${s}`;
                return (
                  <Pressable
                    key={String(s)}
                    style={[
                      styles.seasonPill,
                      {
                        backgroundColor: active ? colors.accent : colors.surfaceHighlight,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                    onPress={() => setActiveSeason(s)}
                  >
                    <Text style={[styles.seasonPillText, { color: active ? '#fff' : colors.textDim }]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View style={[styles.playerWrap, { backgroundColor: '#000' }]}>
            {loadingSeason ? (
              <View style={styles.playerPlaceholder}>
                <ActivityIndicator color={colors.accent} size="large" />
              </View>
            ) : selectedKey ? (
              <YoutubePlayer
                ref={playerRef}
                key={selectedKey}
                height={width * (9 / 16)}
                width={width}
                videoId={selectedKey}
                play
                initialPlayerParams={{ rel: false, modestbranding: true, preventFullScreen: false }}
                webViewProps={{
                  allowsInlineMediaPlayback: true,
                  mediaPlaybackRequiresUserAction: false,
                  allowsFullscreenVideo: true,
                  javaScriptEnabled: true,
                }}
                onReady={() => {
                  playerRef.current?.getDuration().then((d) => {
                    if (d > 0 && selectedKey) {
                      setDurations((prev) => ({ ...prev, [selectedKey]: d }));
                    }
                  });
                }}
              />
            ) : (
              <View style={styles.playerPlaceholder}>
                <Ionicons name="play-circle-outline" size={52} color={colors.textMuted} />
              </View>
            )}
          </View>

          {availableLangs.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.seasonScroll}
              contentContainerStyle={styles.langBar}
            >
              {([null, ...availableLangs] as (string | null)[]).map((lang) => {
                const active = langFilter === lang;
                const label = lang ? lang.toUpperCase() : 'All';
                return (
                  <Pressable
                    key={label}
                    style={[
                      styles.langPill,
                      {
                        backgroundColor: active ? colors.surfaceHighlight : 'transparent',
                        borderColor: active ? colors.border : 'transparent',
                      },
                    ]}
                    onPress={() => setLangFilter(lang)}
                  >
                    <Text style={[styles.langPillText, { color: active ? colors.text : colors.textMuted }]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filteredVideos.length === 0 && !loadingSeason ? (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No videos available for this selection.
              </Text>
            ) : (
              filteredVideos.map((video) => {
                const active = video.key === selectedKey;
                const badge = badgeColors(video.type, colors);
                return (
                  <Pressable
                    key={video.id}
                    style={[
                      styles.videoRow,
                      {
                        borderBottomColor: colors.border,
                        backgroundColor: active ? colors.accentDim : 'transparent',
                      },
                    ]}
                    onPress={() => setSelectedKey(video.key)}
                  >
                    <View style={[styles.playIcon, { backgroundColor: active ? colors.accent : colors.surfaceHighlight }]}>
                      <Ionicons name={active ? 'pause' : 'play'} size={13} color={active ? '#fff' : colors.textDim} />
                    </View>
                    <View style={styles.videoInfo}>
                      <MarqueeText
                        text={video.name}
                        style={[styles.videoName, { color: active ? colors.text : colors.textDim }]}
                        active={active}
                      />
                      <View style={styles.videoMeta}>
                        {video.iso_639_1 ? (
                          <Text style={[styles.langLabel, { color: colors.textMuted }]}>
                            {video.iso_639_1.toUpperCase()}
                          </Text>
                        ) : null}
                        {video.official && (
                          <Text style={[styles.officialLabel, { color: colors.textMuted }]}>Official</Text>
                        )}
                      </View>
                    </View>
                    <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.typeText, { color: badge.text }]}>
                        {video.type.toUpperCase()}
                      </Text>
                      {durations[video.key] != null && (
                        <Text style={[styles.durationText, { color: badge.text }]}>
                          {formatDuration(durations[video.key])}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '82%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: 'center', marginTop: 10, marginBottom: 2,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 12,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  seasonScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  seasonBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  seasonPill: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1,
  },
  seasonPillText: { fontSize: 12, fontWeight: '600' },
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  playerPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  list: { flex: 1 },
  videoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: 1, gap: 12,
  },
  playIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  videoInfo: { flex: 1 },
  videoName: { fontSize: 14, fontWeight: '500' },
  videoMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  langLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  officialLabel: { fontSize: 11 },
  langBar: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  langPill: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 8, borderWidth: 1,
  },
  langPillText: { fontSize: 12, fontWeight: '600' },
  typeBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, flexShrink: 0,
  },
  typeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  durationText: { fontSize: 9, fontWeight: '500', letterSpacing: 0.2, marginTop: 1, opacity: 0.8, textAlign: 'center' },
  emptyText: {
    textAlign: 'center', paddingVertical: 28, fontSize: 14,
  },
});
