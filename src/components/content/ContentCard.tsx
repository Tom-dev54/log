import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem } from '../../store/types';
import { StatusPill } from './StatusPill';
import { formatRelative, daysSince } from '../../utils/date';
import { scoreColor } from '../../utils/scoring';

interface ContentCardProps {
  item: ContentItem;
  onPress: () => void;
}

export function ContentCard({ item, onPress }: ContentCardProps) {
  const retroUrgent =
    item.status === 'published' && item.publishedAt && daysSince(item.publishedAt) >= 3;

  return (
    <Pressable
      className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-3 shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900 dark:text-white"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.topic ? (
            <Text className="text-xs text-gray-400 mt-1"># {item.topic}</Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ marginTop: 2 }} />
      </View>

      <View className="flex-row items-center mt-3 gap-2 flex-wrap">
        <StatusPill status={item.status} />
        {item.score ? (
          <View
            style={{
              backgroundColor: scoreColor(item.score.total) + '22',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 3,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Ionicons name="star" size={11} color={scoreColor(item.score.total)} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: scoreColor(item.score.total),
              }}
            >
              {item.score.total}
            </Text>
          </View>
        ) : null}
        {retroUrgent ? (
          <View className="bg-orange-100 rounded-xl px-2 py-1">
            <Text className="text-orange-600 text-xs font-semibold">待复盘</Text>
          </View>
        ) : null}
        <Text className="text-xs text-gray-400 ml-auto">{formatRelative(item.updatedAt)}</Text>
      </View>
    </Pressable>
  );
}
