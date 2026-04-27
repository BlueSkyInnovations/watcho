export const DarkColors = {
  background: '#0D0D14',
  surface: '#16162A',
  surfaceHighlight: '#1E1E35',
  border: '#2A2A40',
  accent: '#E50914',
  accentDim: 'rgba(229, 9, 20, 0.2)',
  gold: '#F5C518',
  text: '#FFFFFF',
  textDim: '#8888A0',
  textMuted: '#555570',
  success: '#4CAF50',
  tabBar: '#111118',
  overlay: 'rgba(13, 13, 20, 0.85)',
} as const;

export const LightColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceHighlight: '#E8E8EF',
  border: '#D1D1E0',
  accent: '#E50914',
  accentDim: 'rgba(229, 9, 20, 0.12)',
  gold: '#B8860B',
  text: '#0D0D14',
  textDim: '#44445A',
  textMuted: '#9999A8',
  success: '#2E7D32',
  tabBar: '#FFFFFF',
  overlay: 'rgba(242, 242, 247, 0.92)',
} as const;

export type ColorPalette = typeof DarkColors;

// Backward-compat alias (screens migrated to useColors() don't need this)
export const Colors = DarkColors;

export const StatusColors: Record<string, string> = {
  watchlist: '#3B82F6',
  watching: '#F59E0B',
  watched: '#10B981',
};

export const StatusLabels: Record<string, string> = {
  watchlist: 'Watchlist',
  watching: 'Watching',
  watched: 'Watched',
};
