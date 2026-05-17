import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <View
      style={{ backgroundColor: color + '22', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}
