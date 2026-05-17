import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActualMetrics, Prediction } from '../../store/types';

interface MetricsComparisonProps {
  prediction: Prediction;
  actual: ActualMetrics;
}

const METRICS = [
  { key: 'views', pKey: 'predictedViews', label: '浏览', icon: 'eye-outline' },
  { key: 'collects', pKey: 'predictedCollects', label: '收藏', icon: 'bookmark-outline' },
  { key: 'likes', pKey: 'predictedLikes', label: '点赞', icon: 'heart-outline' },
  { key: 'comments', pKey: 'predictedComments', label: '评论', icon: 'chatbubble-outline' },
] as const;

export function MetricsComparison({ prediction, actual }: MetricsComparisonProps) {
  return (
    <View className="gap-2">
      <View className="flex-row mb-1">
        <View style={{ width: 80 }} />
        <Text className="flex-1 text-xs font-semibold text-gray-400 text-center">预测</Text>
        <Text className="flex-1 text-xs font-semibold text-gray-400 text-center">实际</Text>
        <Text className="w-16 text-xs font-semibold text-gray-400 text-right">偏差</Text>
      </View>
      {METRICS.map((m) => {
        const pred = prediction[m.pKey];
        const act = actual[m.key as keyof ActualMetrics] as number;
        const pct = act === 0 ? 0 : Math.round(((act - pred) / pred) * 100);
        const up = pct >= 0;
        const delta = up ? `+${pct}%` : `${pct}%`;
        const deltaColor = up ? '#10B981' : '#EF4444';

        return (
          <View key={m.key} className="flex-row items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
            <View className="flex-row items-center gap-1" style={{ width: 80 }}>
              <Ionicons name={m.icon as any} size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">{m.label}</Text>
            </View>
            <Text className="flex-1 text-base font-semibold text-gray-500 dark:text-gray-400 text-center">
              {pred.toLocaleString()}
            </Text>
            <Text className="flex-1 text-base font-bold text-gray-900 dark:text-white text-center">
              {act.toLocaleString()}
            </Text>
            <Text style={{ color: deltaColor, fontSize: 13, fontWeight: '700', width: 64, textAlign: 'right' }}>
              {delta}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
