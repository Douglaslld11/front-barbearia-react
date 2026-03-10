import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'elevated' | 'flat' | 'outline';
  animated?: boolean;
  delay?: number;
}

export function Card({ children, style, variant = 'elevated', animated = false, delay = 0 }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'flat':
        return styles.flat;
      case 'outline':
        return styles.outline;
      default:
        return styles.elevated;
    }
  };

  const content = (
    <View style={[styles.card, getVariantStyles(), style]}>
      {children}
    </View>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInUp.delay(delay).springify().damping(18)}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.surface,
  },
  elevated: {
    ...(SHADOWS.medium as any),
  },
  flat: {
    backgroundColor: COLORS.surfaceLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
});
