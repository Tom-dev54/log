import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'document-outline', title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 gap-3">
      <Ionicons name={icon} size={56} color="#D1D5DB" />
      <Text className="text-lg font-semibold text-gray-400 dark:text-gray-500">{title}</Text>
      {subtitle ? (
        <Text className="text-sm text-gray-400 dark:text-gray-600 text-center px-8">{subtitle}</Text>
      ) : null}
    </View>
  );
}
