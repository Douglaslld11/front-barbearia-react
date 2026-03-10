import React from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import { useBarbearia } from '../../stores/BarbeariaContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  style,
  textStyle
}: ButtonProps) {
  const { barbearia } = useBarbearia();
  const primaryColor = barbearia?.colors?.primary || COLORS.primary;
  const backgroundColor = barbearia?.colors?.background || COLORS.background;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(0.8, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return [styles.outline, { borderColor: primaryColor }];
      case 'ghost':
        return styles.ghost;
      default:
        return [styles.primary, { backgroundColor: primaryColor }];
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return { color: primaryColor };
      case 'ghost':
        return { color: COLORS.textMuted };
      default:
        return { color: backgroundColor };
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getVariantStyles(),
        (disabled || isLoading) && styles.disabled,
        animatedStyle,
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? backgroundColor : primaryColor} />
      ) : (
        <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    flexDirection: 'row',
  },
  primary: {
    ...(SHADOWS.medium as any),
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    ...TYPOGRAPHY.button,
  },
});
