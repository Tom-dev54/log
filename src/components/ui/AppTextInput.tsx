import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function AppTextInput({ label, error, style, ...props }: AppTextInputProps) {
  return (
    <View className="gap-1">
      {label ? (
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</Text>
      ) : null}
      <TextInput
        className={`bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 text-base ${error ? 'border border-red-500' : ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error ? (
        <Text className="text-xs text-red-500">{error}</Text>
      ) : null}
    </View>
  );
}
