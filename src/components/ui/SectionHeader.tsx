import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
      {action ? (
        <Pressable onPress={action.onPress}>
          <Text className="text-sm text-primary font-semibold">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
