import { Ionicons } from '@expo/vector-icons';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss';
import type { TMDBEpisode } from '@/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  episode: TMDBEpisode | null;
  seasonNumber: number;
  showTitle: string;
}

export function EpisodeModal({ visible, onClose, episode, seasonNumber, showTitle }: Props) {
  const colors = useColors();
  const { t } = useTranslation();
  const { dragY, backdropOpacity, panHandlers, dismiss } = useSwipeToDismiss(visible, onClose);

  const stillUri = episode?.still_path
    ? `https://image.tmdb.org/t/p/w780${episode.still_path}`
    : null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
      <View style={styles.root}>
        {/* Animated dark backdrop */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.backdropOverlay, { opacity: backdropOpacity }]}
          pointerEvents="none"
        />
        {/* Tap outside the sheet to dismiss */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={dismiss} />

        <View style={styles.sheetWrapper} pointerEvents="box-none">
          {/*
            Animated.View + onStartShouldSetResponder absorbs taps on empty sheet
            space so they don't reach the backdrop Pressable behind it.
            panHandlers are only on the handle pill, giving the PanResponder
            exclusive control there via onStartShouldSetPanResponder.
          */}
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: colors.surface, borderColor: colors.border },
              { transform: [{ translateY: dragY }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Handle pill — the only drag target */}
            <View {...panHandlers} style={styles.handleZone}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* Header: title + close button, separate from drag zone */}
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.headerSuper, { color: colors.textMuted }]} numberOfLines={1}>
                  {showTitle}{'  ·  '}S{seasonNumber}E{episode?.episode_number}
                </Text>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={2}>
                  {episode?.name}
                </Text>
              </View>
              <Pressable onPress={dismiss} hitSlop={12} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textDim} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces>
              {stillUri ? (
                <Image source={{ uri: stillUri }} style={styles.still} resizeMode="cover" />
              ) : (
                <View style={[styles.still, styles.stillPlaceholder, { backgroundColor: colors.surfaceHighlight }]}>
                  <Ionicons name="film-outline" size={40} color={colors.textMuted} />
                </View>
              )}

              <View style={styles.body}>
                <View style={styles.metaRow}>
                  {episode?.air_date ? (
                    <View style={[styles.metaChip, { backgroundColor: colors.surfaceHighlight }]}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textDim} />
                      <Text style={[styles.metaText, { color: colors.textDim }]}>{episode.air_date}</Text>
                    </View>
                  ) : null}
                  {(episode?.vote_average ?? 0) > 0 ? (
                    <View style={[styles.metaChip, { backgroundColor: colors.surfaceHighlight }]}>
                      <Ionicons name="star" size={12} color={colors.gold} />
                      <Text style={[styles.metaText, { color: colors.gold }]}>
                        {episode!.vote_average.toFixed(1)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {episode?.overview ? (
                  <Text style={[styles.overview, { color: colors.textDim }]}>
                    {episode.overview}
                  </Text>
                ) : (
                  <Text style={[styles.noOverview, { color: colors.textMuted }]}>
                    {t('detail.episodeNoOverview')}
                  </Text>
                )}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdropOverlay: { backgroundColor: 'rgba(0,0,0,0.65)' },
  sheetWrapper: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  handleZone: { alignItems: 'center', paddingTop: 10, paddingBottom: 12 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingBottom: 12, gap: 12,
  },
  headerText: { flex: 1, gap: 3 },
  headerSuper: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  headerTitle: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  closeBtn: { marginTop: 2 },
  still: { width: '100%', aspectRatio: 16 / 9 },
  stillPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 16, gap: 14 },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  metaText: { fontSize: 12, fontWeight: '600' },
  overview: { fontSize: 14, lineHeight: 22 },
  noOverview: { fontSize: 14, fontStyle: 'italic' },
});
