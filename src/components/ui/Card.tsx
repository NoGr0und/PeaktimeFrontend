import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '../../constants/theme';

interface CardProps extends ViewProps {
  glass?: boolean;
}

export const Card = ({ glass = false, style, children, ...props }: CardProps) => {
  if (glass) {
    return (
      <View style={[styles.container, styles.glassContainer, style]} {...props}>
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          {children}
        </BlurView>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.solidContainer, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  solidContainer: {
    backgroundColor: Theme.colors.surface,
  },
  glassContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  blur: {
    padding: Theme.spacing.lg,
  },
});
