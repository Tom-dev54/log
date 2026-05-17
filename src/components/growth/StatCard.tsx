import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export function StatCard({ label, value, unit, color = '#FF2D55' }: StatCardProps) {
  return (
    <View
      className="flex-1 rounded-2xl p-4 items-center gap-1"
      style={{ backgroundColor: color + '12' }}
    >
      <Text style={{ color, fontSize: 26, fontWeight: '800' }}>{value}</Text>
      {unit ? <Text style={{ color, fontSize: 12 }}>{unit}</Text> : null}
      <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">{label}</Text>
    </View>
  );
}
