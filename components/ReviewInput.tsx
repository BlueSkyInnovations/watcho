import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  value: string;
  onSave: (text: string) => void;
}

export function ReviewInput({ value, onSave }: Props) {
  const colors = useColors();
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  function handleBlur() {
    const trimmed = text.trim();
    if (trimmed !== value.trim()) {
      onSave(trimmed);
    }
  }

  return (
    <TextInput
      style={[styles.input, {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        color: colors.text,
      }]}
      value={text}
      onChangeText={setText}
      onBlur={handleBlur}
      placeholder="Write your thoughts..."
      placeholderTextColor={colors.textMuted}
      multiline
      textAlignVertical="top"
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 21,
    minHeight: 100,
  },
});
