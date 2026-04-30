import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StatusColors } from '@/constants/Colors';
import { useColors } from '@/hooks/useColors';
import { WatchStatus } from '@/types';

const STATUSES: WatchStatus[] = ['watchlist', 'watching', 'watched'];

interface StatusSelectorProps {
  value?: WatchStatus;
  onChange: (status: WatchStatus) => void;
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  const colors = useColors();
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {STATUSES.map((s) => {
        const active = s === value;
        return (
          <Pressable
            key={s}
            style={[
              styles.button,
              { backgroundColor: colors.surface, borderColor: colors.border },
              active && { backgroundColor: StatusColors[s], borderColor: StatusColors[s] },
            ]}
            onPress={() => onChange(s)}
          >
            <Text style={[styles.label, { color: colors.textDim }, active && styles.labelActive]}>
              {t(`status.${s}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  button: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  label: { fontSize: 13, fontWeight: '600' },
  labelActive: { color: '#fff' },
});
