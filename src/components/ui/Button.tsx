import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button = ({ title, variant = 'primary', isLoading, style, accessibilityLabel, ...props }: ButtonProps) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, style]}
        disabled={isLoading || props.disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: isLoading || props.disabled }}
        {...props}
      >
        <LinearGradient
          colors={Theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {isLoading ? (
            <ActivityIndicator color={Theme.colors.background} />
          ) : (
            <Text style={styles.primaryText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        styles.secondaryContainer,
        variant === 'outline' && styles.outlineContainer,
        style
      ]}
      disabled={isLoading || props.disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isLoading || props.disabled }}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={Theme.colors.primary} />
      ) : (
        <Text style={[styles.secondaryText, variant === 'outline' && styles.outlineText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: Theme.borderRadius.round,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    backgroundColor: Theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  primaryText: {
    color: Theme.colors.background,
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
  },
  secondaryText: {
    color: Theme.colors.text,
    fontFamily: Theme.typography.fonts.bold,
    fontSize: Theme.typography.sizes.md,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
});
