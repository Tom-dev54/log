import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { TopicCard } from '../../src/components/topics/TopicCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ConfirmSheet } from '../../src/components/ui/ConfirmSheet';
import { TopicIdea } from '../../src/store/types';

type PriorityFilter = 'all' | TopicIdea['priority'];

const FILTERS: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'hot', label: '热门' },
  { value: 'normal', label: '普通' },
  { value: 'low', label: '低优' },
];

export default function TopicsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<PriorityFilter>('all');
  const [promoteId, setPromoteId] = useState<string | null>(null);

  const topics = useStore((s) => s.topics);
  const promoteTopicToContent = useStore((s) => s.promoteTopicToContent);

  const filtered = topics
    .filter((t) => filter === 'all' || t.priority === filter)
    .sort((a, b) => {
      const order = { hot: 0, normal: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">选题池</Text>
        <View className="flex-row gap-2">
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <Pressable
                key={f.value}
                onPress={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full ${active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            icon="bulb-outline"
            title="还没有选题"
            subtitle="点击右下角 + 添加创意想法"
          />
        }
        renderItem={({ item }) => (
          <TopicCard
            topic={item}
            onPress={() => router.push({ pathname: '/topic/[id]', params: { id: item.id } })}
            onPromote={() => setPromoteId(item.id)}
          />
        )}
      />

      <Pressable
        className="absolute bottom-24 right-5 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/topic/new')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <ConfirmSheet
        visible={promoteId !== null}
        title="升级为内容"
        message="该选题将升级为内容进入创作流程，同时从选题池移除"
        confirmLabel="确认升级"
        onConfirm={() => {
          if (promoteId) {
            const contentId = promoteTopicToContent(promoteId);
            setPromoteId(null);
            if (contentId) {
              router.push({ pathname: '/content/[id]', params: { id: contentId } });
            }
          }
        }}
        onCancel={() => setPromoteId(null)}
      />
    </SafeAreaView>
  );
}
