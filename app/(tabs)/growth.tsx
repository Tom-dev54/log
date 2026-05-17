import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { useGrowthStats } from '../../src/hooks/useGrowthStats';
import { StatCard } from '../../src/components/growth/StatCard';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { accuracyColor } from '../../src/utils/accuracy';
import { scoreColor } from '../../src/utils/scoring';

export default function GrowthScreen() {
  const stats = useGrowthStats();

  const accuracyData = stats.accuracyHistory.map((x) => ({
    value: x.accuracy,
    label: x.label,
    dataPointText: `${x.accuracy}%`,
  }));

  const scoreData = stats.scoreHistory.map((x) => ({
    value: x.score,
    label: x.label,
    dataPointText: `${x.score}`,
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">成长曲线</Text>
        </View>

        {/* summary stats */}
        <View className="flex-row gap-3 mb-6">
          <StatCard label="发布内容" value={stats.totalPublished} color="#3B82F6" />
          <StatCard label="完成复盘" value={stats.totalRetros} color="#8B5CF6" />
        </View>
        <View className="flex-row gap-3 mb-6">
          <StatCard
            label="平均准确率"
            value={stats.avgAccuracy}
            unit="%"
            color={accuracyColor(stats.avgAccuracy)}
          />
          <StatCard
            label="平均打分"
            value={stats.avgScore}
            unit="/10"
            color={scoreColor(stats.avgScore)}
          />
        </View>

        {/* accuracy chart */}
        <View className="mb-6">
          <SectionHeader title="预测准确率趋势" />
          {accuracyData.length >= 2 ? (
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-4">
              <LineChart
                data={accuracyData}
                height={180}
                spacing={48}
                initialSpacing={16}
                color="#FF2D55"
                thickness={2}
                dataPointsColor="#FF2D55"
                dataPointsRadius={4}
                yAxisColor="#E5E7EB"
                xAxisColor="#E5E7EB"
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 9 }}
                maxValue={100}
                noOfSections={4}
                curved
                showDataPointOnFocus
              />
            </View>
          ) : (
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 items-center">
              <Text className="text-gray-400 text-sm text-center">
                完成 2 次以上复盘后显示趋势图
              </Text>
            </View>
          )}
        </View>

        {/* score chart */}
        <View className="mb-6">
          <SectionHeader title="内容打分趋势" />
          {scoreData.length >= 2 ? (
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-4">
              <LineChart
                data={scoreData}
                height={180}
                spacing={48}
                initialSpacing={16}
                color="#8B5CF6"
                thickness={2}
                dataPointsColor="#8B5CF6"
                dataPointsRadius={4}
                yAxisColor="#E5E7EB"
                xAxisColor="#E5E7EB"
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 9 }}
                maxValue={10}
                noOfSections={5}
                curved
                showDataPointOnFocus
              />
            </View>
          ) : (
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 items-center">
              <Text className="text-gray-400 text-sm text-center">
                完成 2 条以上打分后显示趋势图
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
