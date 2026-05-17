import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ContentItem } from '../../store/types';
import { StatusPill } from '../content/StatusPill';
import { formatRelative } from '../../utils/date';

interface RecentActivityProps {
  items: ContentItem[];
  onPress: (id: string) => void;
}

export function RecentActivity({ items, onPress }: RecentActivityProps) {
  if (items.length === 0) return null;
  return (
    <View className="gap-2">
      {items.map((item) => (
        <Pressable
          key={item.id}
          className="flex-row items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-3"
          onPress={() => onPress(item.id)}
        >
          <View className="flex-1">
            <Text
              className="text-sm font-semibold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">{formatRelative(item.updatedAt)}</Text>
          </View>
          <StatusPill status={item.status} />
        </Pressable>
      ))}
    </View>
  );
}
