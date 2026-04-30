const YT_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY ?? '';

function parseISO8601Duration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? '0') * 3600) + (parseInt(m[2] ?? '0') * 60) + parseInt(m[3] ?? '0');
}

export async function fetchYouTubeDurations(keys: string[]): Promise<Record<string, number>> {
  if (!YT_KEY || keys.length === 0) return {};
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=contentDetails&id=${keys.join(',')}&key=${YT_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return {};
    const data = await res.json() as {
      items: { id: string; contentDetails: { duration: string } }[];
    };
    return Object.fromEntries(
      (data.items ?? [])
        .map((item) => [item.id, parseISO8601Duration(item.contentDetails?.duration ?? '')] as const)
        .filter(([, d]) => d > 0)
    );
  } catch {
    return {};
  }
}
