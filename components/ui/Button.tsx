import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        isDisabled && styles[`${variant}Disabled`]
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : '#8B5CF6'}
            style={styles.loader}
          />
        )}
        <Text style={[
          styles.text,
          styles[`${variant}Text`],
          isDisabled && styles[`${variant}TextDisabled`]
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: '#8B5CF6',
  },
  secondary: {
    backgroundColor: '#059669',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#8B5CF6',
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },

  // Text styles
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  outlineText: {
    color: '#8B5CF6',
    fontSize: 16,
  },
  ghostText: {
    color: '#8B5CF6',
    fontSize: 16,
  },

  // Disabled states
  disabled: {
    opacity: 0.6,
  },
  primaryDisabled: {
    backgroundColor: '#9CA3AF',
  },
  secondaryDisabled: {
    backgroundColor: '#9CA3AF',
  },
  outlineDisabled: {
    borderColor: '#9CA3AF',
  },
  primaryTextDisabled: {
    color: '#FFFFFF',
  },
  secondaryTextDisabled: {
    color: '#FFFFFF',
  },
  outlineTextDisabled: {
    color: '#9CA3AF',
  },
  ghostTextDisabled: {
    color: '#9CA3AF',
  },

  // Full width
  fullWidth: {
    width: '100%',
  },

  // Size text
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});