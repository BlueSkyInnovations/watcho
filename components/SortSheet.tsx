import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { SortOrder } from '@/types';

interface SortOption {
  value: SortOrder;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'added_at', label: 'Date Added', icon: 'add-circle-outline' },
  { value: 'release_date', label: 'Release Date', icon: 'calendar-outline' },
  { value: 'updated_at', label: 'Last Updated', icon: 'time-outline' },
];

interface SortSheetProps {
  visible: boolean;
  value: SortOrder;
  onChange: (order: SortOrder) => void;
  onClose: () => void;
}

export function SortSheet({ visible, value, onChange, onClose }: SortSheetProps) {
  const colors = useColors();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.textDim }]}>Sort by</Text>

          {SORT_OPTIONS.map((opt, index) => {
            const active = value === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.row,
                  index < SORT_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  active && { backgroundColor: colors.accentDim },
                ]}
                onPress={() => { onChange(opt.value); onClose(); }}
              >
                <Ionicons name={opt.icon} size={20} color={active ? colors.accent : colors.textDim} />
                <Text style={[styles.label, { color: active ? colors.accent : colors.text }]}>
                  {opt.label}
                </Text>
                {active && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
