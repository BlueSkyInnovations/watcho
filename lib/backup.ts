import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { MediaItem } from '@/types';

export interface BackupFile {
  version: '1';
  exportedAt: string;
  watchlist: MediaItem[];
}

export type MergeStrategy =
  | 'replace'
  | 'merge_keep_existing'
  | 'merge_keep_backup'
  | 'merge_keep_newest';

function itemKey(item: MediaItem): string {
  return `${item.mediaType}:${item.id}`;
}

export function mergeWatchlists(
  existing: MediaItem[],
  imported: MediaItem[],
  strategy: MergeStrategy
): MediaItem[] {
  if (strategy === 'replace') return [...imported];

  const existingMap = new Map(existing.map((i) => [itemKey(i), i]));
  const result = [...existing];

  for (const item of imported) {
    const key = itemKey(item);
    if (!existingMap.has(key)) {
      result.push(item);
      continue;
    }
    if (strategy === 'merge_keep_existing') continue;
    if (strategy === 'merge_keep_backup') {
      const idx = result.findIndex((i) => itemKey(i) === key);
      if (idx !== -1) result[idx] = item;
    } else if (strategy === 'merge_keep_newest') {
      const curr = existingMap.get(key)!;
      const currDate = new Date(curr.updatedAt ?? curr.addedAt).getTime();
      const importedDate = new Date(item.updatedAt ?? item.addedAt).getTime();
      if (importedDate > currDate) {
        const idx = result.findIndex((i) => itemKey(i) === key);
        if (idx !== -1) result[idx] = item;
      }
    }
  }

  return result;
}

export async function exportWatchlist(items: MediaItem[]): Promise<void> {
  const backup: BackupFile = {
    version: '1',
    exportedAt: new Date().toISOString(),
    watchlist: items,
  };

  const date = new Date().toISOString().slice(0, 10);
  const uri = `${FileSystem.cacheDirectory}watcho-backup-${date}.json`;

  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2));

  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Sharing not available on this device');

  await Sharing.shareAsync(uri, {
    mimeType: 'application/json',
    dialogTitle: 'Export watcho backup',
    UTI: 'public.json',
  });
}

export async function readBackupFile(uri: string): Promise<BackupFile> {
  const content = await FileSystem.readAsStringAsync(uri);
  return parseBackupJson(content);
}

export function parseBackupJson(json: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as BackupFile).version !== '1' ||
    !Array.isArray((parsed as BackupFile).watchlist)
  ) {
    throw new Error('Invalid backup format');
  }

  for (const item of (parsed as BackupFile).watchlist) {
    if (
      typeof (item as MediaItem).id !== 'number' ||
      ((item as MediaItem).mediaType !== 'movie' && (item as MediaItem).mediaType !== 'tv') ||
      typeof (item as MediaItem).title !== 'string'
    ) {
      throw new Error('Invalid backup: malformed item');
    }
  }

  return parsed as BackupFile;
}
