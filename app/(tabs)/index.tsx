import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { selectPipelineCounts, selectRetroReady } from '../../src/store/selectors';
import { PipelineSummary } from '../../src/components/dashboard/PipelineSummary';
import { RetroAlert } from '../../src/components/dashboard/RetroAlert';
import { RecentActivity } from '../../src/components/dashboard/RecentActivity';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { ContentStatus } from '../../src/store/types';
import { formatDate } from '../../src/utils/date';

export default function DashboardScreen() {
  const router = useRouter();
  const contents = useStore((s) => s.contents);
  const counts = selectPipelineCounts(contents);
  const retroReady = selectRetroReady(contents);
  const recent = [...contents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  function handlePipelinePress(status: ContentStatus) {
    router.push({ pathname: '/(tabs)/contents', params: { filter: status } });
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">创作看板</Text>
          <Text className="text-sm text-gray-400 mt-1">{formatDate(new Date().toISOString())}</Text>
        </View>

        {retroReady.length > 0 && (
          <View className="mb-4">
            <RetroAlert
              count={retroReady.length}
              onPress={() => handlePipelinePress('published')}
            />
          </View>
        )}

        <View className="mb-6">
          <SectionHeader title="流程看板" />
          <PipelineSummary counts={counts} onPress={handlePipelinePress} />
        </View>

        <View>
          <SectionHeader
            title="最近动态"
            action={
              recent.length > 0
                ? { label: '查看全部', onPress: () => router.push('/(tabs)/contents') }
                : undefined
            }
          />
          <RecentActivity
            items={recent}
            onPress={(id) => router.push({ pathname: '/content/[id]', params: { id } })}
          />
          {recent.length === 0 && (
            <Text className="text-gray-400 text-sm text-center py-8">
              还没有内容，去新建一条吧
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
