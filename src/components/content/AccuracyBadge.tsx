import React from 'react';
import { Text, View } from 'react-native';
import { accuracyColor } from '../../utils/accuracy';

export function AccuracyBadge({ accuracy }: { accuracy: number }) {
  const color = accuracyColor(accuracy);
  return (
    <View className="items-center gap-1">
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          borderWidth: 4,
          borderColor: color,
          backgroundColor: color + '15',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color, fontSize: 22, fontWeight: '800' }}>{accuracy}</Text>
        <Text style={{ color, fontSize: 11, fontWeight: '600' }}>%</Text>
      </View>
      <Text className="text-sm text-gray-500 dark:text-gray-400">预测准确率</Text>
    </View>
  );
}
