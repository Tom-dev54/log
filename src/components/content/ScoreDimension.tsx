import React from 'react';
import { Text, View } from 'react-native';
import { ScoreSlider } from '../ui/ScoreSlider';

interface ScoreDimensionProps {
  label: string;
  desc: string;
  value: number;
  onChange: (v: number) => void;
}

export function ScoreDimension({ label, desc, value, onChange }: ScoreDimensionProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-baseline gap-2 mb-1">
        <Text className="text-base font-bold text-gray-900 dark:text-white">{label}</Text>
        <Text className="text-xs text-gray-400">{desc}</Text>
      </View>
      <ScoreSlider value={value} onChange={onChange} />
    </View>
  );
}
