import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Prediction } from '../../store/types';
import { formatDate } from '../../utils/date';

const CONFIDENCE_LABEL = { high: '高', medium: '中', low: '低' };
const CONFIDENCE_COLOR = { high: '#10B981', medium: '#F59E0B', low: '#EF4444' };

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const cColor = CONFIDENCE_COLOR[prediction.confidence];
  return (
    <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 gap-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="lock-closed" size={14} color="#F59E0B" />
          <Text className="text-sm font-bold text-amber-700 dark:text-amber-400">预测已锁定</Text>
        </View>
        <Text className="text-xs text-gray-400">{formatDate(prediction.lockedAt)}</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {[
          { label: '浏览', value: prediction.predictedViews, icon: 'eye-outline' },
          { label: '收藏', value: prediction.predictedCollects, icon: 'bookmark-outline' },
          { label: '点赞', value: prediction.predictedLikes, icon: 'heart-outline' },
          { label: '评论', value: prediction.predictedComments, icon: 'chatbubble-outline' },
        ].map((m) => (
          <View key={m.label} className="items-center flex-1 min-w-16">
            <Ionicons name={m.icon as any} size={16} color="#6B7280" />
            <Text className="text-base font-bold text-gray-900 dark:text-white mt-1">{m.value.toLocaleString()}</Text>
            <Text className="text-xs text-gray-400">{m.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-xs text-gray-500">置信度</Text>
        <View style={{ backgroundColor: cColor + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: cColor, fontSize: 12, fontWeight: '700' }}>
            {CONFIDENCE_LABEL[prediction.confidence]}
          </Text>
        </View>
      </View>

      {prediction.reasoning ? (
        <Text className="text-sm text-gray-600 dark:text-gray-400 italic">
          "{prediction.reasoning}"
        </Text>
      ) : null}
    </View>
  );
}
