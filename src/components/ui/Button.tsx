import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  PressableProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  loading?: boolean;
}

const VARIANTS = {
  primary: {
    container: 'bg-primary rounded-2xl py-4 px-6 items-center',
    text: 'text-white text-base font-bold',
  },
  secondary: {
    container: 'bg-gray-100 dark:bg-gray-800 rounded-2xl py-4 px-6 items-center',
    text: 'text-gray-800 dark:text-gray-100 text-base font-semibold',
  },
  destructive: {
    container: 'bg-red-500 rounded-2xl py-4 px-6 items-center',
    text: 'text-white text-base font-bold',
  },
  ghost: {
    container: 'rounded-2xl py-3 px-4 items-center',
    text: 'text-primary text-base font-semibold',
  },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      className={v.container + (disabled || loading ? ' opacity-50' : '')}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.(e);
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#374151' : '#fff'} />
      ) : (
        <Text className={v.text}>{title}</Text>
      )}
    </Pressable>
  );
}
