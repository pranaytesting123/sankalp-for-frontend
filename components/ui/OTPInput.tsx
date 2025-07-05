import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  length: number;
  error?: boolean;
}

export function OTPInput({ value, onChange, length, error = false }: OTPInputProps) {
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChangeText = (text: string, index: number) => {
    const newOTP = value.split('');
    newOTP[index] = text;
    const otpString = newOTP.join('');
    
    onChange(otpString);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    // Select the text when focusing
    const input = inputRefs.current[index];
    if (input && value[index]) {
      input.setSelection(0, 1);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) {
              inputRefs.current[index] = ref;
            }
          }}
          style={[
            styles.input,
            error && styles.inputError,
            value[index] && styles.inputFilled
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChangeText(text.slice(-1), index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          onFocus={() => handleFocus(index)}
          maxLength={1}
          keyboardType="numeric"
          textAlign="center"
          selectTextOnFocus
          autoComplete="one-time-code"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  inputFilled: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
});