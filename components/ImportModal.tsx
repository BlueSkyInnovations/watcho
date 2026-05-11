import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import type { BackupFile, MergeStrategy } from '@/lib/backup';

type ConflictStrategy = 'keep_existing' | 'keep_backup' | 'keep_newest';

interface Props {
  backup: BackupFile;
  existingCount: number;
  onConfirm: (strategy: MergeStrategy) => void;
  onClose: () => void;
}

export function ImportModal({ backup, existingCount, onConfirm, onClose }: Props) {
  const colors = useColors();
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'replace' | 'merge'>('merge');
  const [conflict, setConflict] = useState<ConflictStrategy>('keep_newest');

  const backupDate = new Date(backup.exportedAt).toLocaleDateString(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const itemCount = backup.watchlist.length;

  function handleConfirm() {
    let strategy: MergeStrategy;
    if (mode === 'replace') {
      strategy = 'replace';
    } else {
      strategy =
        conflict === 'keep_existing'
          ? 'merge_keep_existing'
          : conflict === 'keep_backup'
            ? 'merge_keep_backup'
            : 'merge_keep_newest';
    }
    onConfirm(strategy);
  }

  const conflictOptions: { value: ConflictStrategy; labelKey: string }[] = [
    { value: 'keep_existing', labelKey: 'settings.data.keepExisting' },
    { value: 'keep_backup', labelKey: 'settings.data.keepBackup' },
    { value: 'keep_newest', labelKey: 'settings.data.keepNewest' },
  ];

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('settings.data.importTitle')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {t('settings.data.importMeta', { count: itemCount, date: backupDate })}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              {t('settings.data.importMode')}
            </Text>

            {/* Replace option */}
            <Pressable
              style={[
                styles.optionRow,
                { borderColor: colors.border },
                mode === 'replace' && { backgroundColor: colors.accentDim },
              ]}
              onPress={() => setMode('replace')}
            >
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, { color: mode === 'replace' ? colors.accent : colors.text }]}>
                  {t('settings.data.replaceAll')}
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                  {t('settings.data.replaceAllDesc')}
                </Text>
              </View>
              {mode === 'replace' && (
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              )}
            </Pressable>

            {/* Merge option */}
            <Pressable
              style={[
                styles.optionRow,
                { borderColor: colors.border, marginTop: 8 },
                mode === 'merge' && { backgroundColor: colors.accentDim },
              ]}
              onPress={() => setMode('merge')}
            >
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, { color: mode === 'merge' ? colors.accent : colors.text }]}>
                  {t('settings.data.merge')}
                </Text>
                <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                  {t('settings.data.mergeDesc')}
                </Text>
              </View>
              {mode === 'merge' && (
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              )}
            </Pressable>

            {/* Conflict resolution (merge only) */}
            {mode === 'merge' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: 20 }]}>
                  {t('settings.data.conflictLabel')}
                </Text>
                {conflictOptions.map((opt, index) => {
                  const active = conflict === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      style={[
                        styles.conflictRow,
                        { borderColor: colors.border },
                        index < conflictOptions.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        },
                        active && { backgroundColor: colors.accentDim },
                      ]}
                      onPress={() => setConflict(opt.value)}
                    >
                      <Text style={[styles.conflictLabel, { color: active ? colors.accent : colors.text }]}>
                        {t(opt.labelKey)}
                      </Text>
                      {active && <Ionicons name="checkmark-circle" size={18} color={colors.accent} />}
                    </Pressable>
                  );
                })}
              </>
            )}

            {/* Destructive warning for replace */}
            {mode === 'replace' && existingCount > 0 && (
              <View style={[styles.warning, { backgroundColor: colors.accentDim, borderColor: colors.accent }]}>
                <Ionicons name="warning-outline" size={15} color={colors.accent} />
                <Text style={[styles.warningText, { color: colors.accent }]}>
                  {t('settings.data.replaceWarning', { count: existingCount })}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Action buttons */}
          <View style={[styles.buttonRow, { borderTopColor: colors.border }]}>
            <Pressable
              style={[styles.btn, { borderColor: colors.border, backgroundColor: colors.surfaceHighlight }]}
              onPress={onClose}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{t('settings.data.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.accent }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>{t('settings.data.importConfirm')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: 10,
    marginLeft: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionText: {
    flex: 1,
    gap: 3,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  conflictRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 0,
  },
  conflictLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    borderWidth: 0,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
