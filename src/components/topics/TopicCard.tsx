import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopicIdea } from '../../store/types';

const PRIORITY_CONFIG = {
  hot: { label: '热门', color: '#EF4444' },
  normal: { label: '普通', color: '#6B7280' },
  low: { label: '低优', color: '#9CA3AF' },
};

interface TopicCardProps {
  topic: TopicIdea;
  onPress: () => void;
  onPromote: () => void;
}

export function TopicCard({ topic, onPress, onPromote }: TopicCardProps) {
  const cfg = PRIORITY_CONFIG[topic.priority];
  return (
    <Pressable
      className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-3"
      onPress={onPress}
    >
      <View className="flex-row items-start gap-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white" numberOfLines={2}>
            {topic.title}
          </Text>
          {topic.description ? (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
              {topic.description}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap gap-2 mt-2">
            <View style={{ backgroundColor: cfg.color + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: cfg.color, fontSize: 11, fontWeight: '600' }}>{cfg.label}</Text>
            </View>
            {topic.tags.map((tag) => (
              <View key={tag} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-0.5">
                <Text className="text-xs text-gray-500 dark:text-gray-400">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable
          className="bg-primary/10 rounded-xl p-2"
          onPress={onPromote}
        >
          <Ionicons name="arrow-forward-outline" size={18} color="#FF2D55" />
        </Pressable>
      </View>
    </Pressable>
  );
}
