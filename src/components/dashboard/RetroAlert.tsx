import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RetroAlertProps {
  count: number;
  onPress: () => void;
}

export function RetroAlert({ count, onPress }: RetroAlertProps) {
  if (count === 0) return null;
  return (
    <Pressable
      className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex-row items-center gap-3"
      onPress={onPress}
    >
      <Ionicons name="time-outline" size={22} color="#F97316" />
      <View className="flex-1">
        <Text className="text-orange-700 dark:text-orange-400 font-bold text-base">
          {count} 条内容待复盘
        </Text>
        <Text className="text-orange-600 dark:text-orange-500 text-sm">
          发布已满 3 天，点击开始复盘
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#F97316" />
    </Pressable>
  );
}
