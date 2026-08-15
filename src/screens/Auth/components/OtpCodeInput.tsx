import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors, radii, spacing } from '../../../theme/ResetPassword/colors';

interface OtpCodeInputProps {
  length?: number;
  onChangeCode: (code: string) => void;
  onCodeComplete?: (code: string) => void;
}

export const OtpCodeInput: React.FC<OtpCodeInputProps> = ({
  length = 6,
  onChangeCode,
  onCodeComplete,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const updateDigits = (next: string[]) => {
    setDigits(next);
    const code = next.join('');
    onChangeCode(code);
    if (code.length === length && next.every(d => d !== '')) {
      onCodeComplete?.(code);
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      updateDigits(next);
      return;
    }

    const next = [...digits];
    const chars = cleaned.split('');
    let cursor = index;
    for (const char of chars) {
      if (cursor >= length) break;
      next[cursor] = char;
      cursor += 1;
    }
    updateDigits(next);

    const nextEmptyIndex = next.findIndex(d => d === '');
    const targetIndex =
      nextEmptyIndex === -1 ? length - 1 : Math.min(cursor, length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      digits[index] === '' &&
      index > 0
    ) {
      const next = [...digits];
      next[index - 1] = '';
      updateDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          style={[styles.cell, focusedIndex === index && styles.cellFocused]}
          value={digits[index]}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          keyboardType="number-pad"
          maxLength={length}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cell: {
    width: 46,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.otpCellBackground,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cellFocused: {
    borderColor: colors.otpCellActiveBorder,
    backgroundColor: colors.white,
  },
});
