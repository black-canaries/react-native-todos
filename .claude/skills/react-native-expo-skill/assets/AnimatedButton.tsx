// AnimatedButton.tsx
// Template component demonstrating NativeWind + Reanimated integration
// Copy this to your components/ folder and customize as needed

import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AnimatedButton({
  title,
  variant = 'primary',
  size = 'md',
  className = '',
  onPress,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 400,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 400,
      });
    }
  };

  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-500 active:bg-gray-600',
    outline: 'bg-transparent border-2 border-blue-500 active:border-blue-600',
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Text color based on variant
  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-500',
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Animated.View
        style={animatedStyle}
        className={`
          rounded-lg
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
      >
        <Text
          className={`
            font-semibold
            text-center
            ${textSizeClasses[size]}
            ${textColorClasses[variant]}
          `}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// Usage example:
/*
import AnimatedButton from './components/AnimatedButton';

function MyScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <AnimatedButton
        title="Press Me"
        variant="primary"
        size="md"
        onPress={() => console.log('Pressed!')}
      />
      
      <AnimatedButton
        title="Secondary"
        variant="secondary"
        size="lg"
        className="mt-4"
        onPress={() => console.log('Secondary pressed!')}
      />
      
      <AnimatedButton
        title="Outline"
        variant="outline"
        size="sm"
        className="mt-4"
        onPress={() => console.log('Outline pressed!')}
      />
    </View>
  );
}
*/
