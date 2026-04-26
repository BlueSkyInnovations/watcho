import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, StatusColors, StatusLabels } from '@/constants/Colors';
import { WatchStatus } from '@/types';

const STATUSES: WatchStatus[] = ['watchlist', 'watching', 'watched'];

interface StatusSelectorProps {
  value?: WatchStatus;
  onChange: (status: WatchStatus) => void;
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <View style={styles.row}>
      {STATUSES.map((s) => {
        const active = s === value;
        return (
          <Pressable
            key={s}
            style={[
              styles.button,
              active && { backgroundColor: StatusColors[s], borderColor: StatusColors[s] },
            ]}
            onPress={() => onChange(s)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {StatusLabels[s]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  label: {
    color: Colors.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
  },
});
