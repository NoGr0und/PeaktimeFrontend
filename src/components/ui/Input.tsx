import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { Theme } from '../../constants/theme';
import { MotiView } from 'moti';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={Theme.colors.textSecondary}
        accessible={true}
        accessibilityLabel={label || props.placeholder || 'Campo de entrada de texto'}
        {...props}
      />
      {error && (
        <MotiView
          from={{ opacity: 0, translateY: -5 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Text style={styles.errorText}>{error}</Text>
        </MotiView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
    width: '100%',
  },
  label: {
    color: Theme.colors.text,
    fontFamily: Theme.typography.fonts.medium,
    fontSize: Theme.typography.sizes.sm,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.text,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    height: 56,
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  inputError: {
    borderColor: Theme.colors.accent,
  },
  errorText: {
    color: Theme.colors.accent,
    fontFamily: Theme.typography.fonts.regular,
    fontSize: Theme.typography.sizes.xs,
    marginTop: Theme.spacing.xs,
  },
});
