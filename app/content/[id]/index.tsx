import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { PipelineProgress } from '../../../src/components/content/PipelineProgress';
import { PredictionCard } from '../../../src/components/content/PredictionCard';
import { ScoreRadar } from '../../../src/components/content/ScoreRadar';
import { MetricsComparison } from '../../../src/components/content/MetricsComparison';
import { AccuracyBadge } from '../../../src/components/content/AccuracyBadge';
import { Button } from '../../../src/components/ui/Button';
import { SectionHeader } from '../../../src/components/ui/SectionHeader';
import { scoreColor } from '../../../src/utils/scoring';
import { formatDate, daysSince } from '../../../src/utils/date';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useStore((s) => s.contents.find((c) => c.id === id));

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-400">内容不存在</Text>
      </SafeAreaView>
    );
  }

  const retroReady =
    item.status === 'published' && item.publishedAt && daysSince(item.publishedAt) >= 3;

  function getPrimaryAction() {
    switch (item!.status) {
      case 'draft':
        return { label: '开始打分', onPress: () => router.push({ pathname: '/content/[id]/score', params: { id } }) };
      case 'scored':
        return { label: '设置预测', onPress: () => router.push({ pathname: '/content/[id]/predict', params: { id } }) };
      case 'predicted':
        return { label: '记录发布', onPress: () => router.push({ pathname: '/content/[id]/publish', params: { id } }) };
      case 'published':
        return retroReady
          ? { label: '开始复盘 🎯', onPress: () => router.push({ pathname: '/content/[id]/retro', params: { id } }) }
          : { label: `发布后 ${3 - daysSince(item!.publishedAt!)} 天可复盘`, onPress: () => {} };
      case 'retro_done':
        return null;
    }
  }

  const primaryAction = getPrimaryAction();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</Text>
          {item.topic ? (
            <Text className="text-sm text-gray-400 mt-1"># {item.topic}</Text>
          ) : null}
          <Text className="text-xs text-gray-400 mt-1">创建于 {formatDate(item.createdAt)}</Text>
        </View>

        {/* pipeline */}
        <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-4">
          <PipelineProgress status={item.status} />
        </View>

        {/* score */}
        {item.score && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-4">
            <SectionHeader title="内容打分" />
            <View className="flex-row items-center gap-4">
              <ScoreRadar score={item.score} size={160} />
              <View className="flex-1 gap-2">
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '800',
                    color: scoreColor(item.score.total),
                  }}
                >
                  {item.score.total}
                </Text>
                <Text className="text-sm text-gray-400">综合得分 / 10</Text>
                {item.score.notes ? (
                  <Text className="text-xs text-gray-500 dark:text-gray-400 italic">
                    "{item.score.notes}"
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        )}

        {/* prediction */}
        {item.prediction && (
          <View className="mb-4">
            <SectionHeader title="盲测预测" />
            <PredictionCard prediction={item.prediction} />
          </View>
        )}

        {/* publish info */}
        {item.publishedAt && (
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-4">
            <Text className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
              发布时间：{formatDate(item.publishedAt)}
            </Text>
            {item.status === 'published' && !retroReady && (
              <Text className="text-xs text-blue-500 mt-1">
                距离可复盘还有 {3 - daysSince(item.publishedAt)} 天
              </Text>
            )}
          </View>
        )}

        {/* retro results */}
        {item.retrospective && item.prediction && item.actualMetrics && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-4">
            <SectionHeader title="复盘结果" />
            <View className="items-center mb-4">
              <AccuracyBadge accuracy={item.retrospective.predictionAccuracy} />
            </View>
            <MetricsComparison prediction={item.prediction} actual={item.actualMetrics} />
            {item.retrospective.keyInsight ? (
              <View className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Text className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                  关键洞察
                </Text>
                <Text className="text-sm text-green-800 dark:text-green-300">
                  {item.retrospective.keyInsight}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {primaryAction && (
        <View className="px-4 pb-6 pt-2">
          <Button
            title={primaryAction.label}
            onPress={primaryAction.onPress}
            disabled={item.status === 'published' && !retroReady}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
