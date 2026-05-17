import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { ContentCard } from '../../src/components/content/ContentCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ConfirmSheet } from '../../src/components/ui/ConfirmSheet';
import { ContentStatus } from '../../src/store/types';

type Filter = ContentStatus | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'scored', label: '已打分' },
  { value: 'predicted', label: '已预测' },
  { value: 'published', label: '已发布' },
  { value: 'retro_done', label: '已复盘' },
];

export default function ContentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const [filter, setFilter] = useState<Filter>((params.filter as Filter) ?? 'all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const contents = useStore((s) => s.contents);
  const deleteContent = useStore((s) => s.deleteContent);

  const filtered = contents
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) =>
      search.trim() === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">内容管理</Text>
        <View className="bg-gray-100 dark:bg-gray-800 rounded-xl flex-row items-center px-3 mb-3 gap-2">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            className="flex-1 py-3 text-gray-900 dark:text-white text-sm"
            placeholder="搜索标题或话题..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTERS}
            keyExtractor={(f) => f.value}
            renderItem={({ item, index }) => {
              const active = item.value === filter;
              return (
                <Pressable
                  onPress={() => setFilter(item.value)}
                  className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="暂无内容"
            subtitle="点击右下角 + 新建第一条内容"
          />
        }
        renderItem={({ item }) => (
          <ContentCard
            item={item}
            onPress={() => router.push({ pathname: '/content/[id]', params: { id: item.id } })}
          />
        )}
      />

      <Pressable
        className="absolute bottom-24 right-5 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/content/new')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <ConfirmSheet
        visible={deleteId !== null}
        title="删除内容"
        message="删除后无法恢复，确认删除？"
        confirmLabel="删除"
        destructive
        onConfirm={() => {
          if (deleteId) deleteContent(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </SafeAreaView>
  );
}
