export const Colors = {
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
