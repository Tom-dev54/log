import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            className={`flex-1 py-2 rounded-lg items-center ${active ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            onPress={() => onChange(opt.value)}
          >
            <Text
              className={`text-sm font-semibold ${active ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
