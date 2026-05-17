import React from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

interface ScoreSliderProps {
  value: number;
  onChange: (v: number) => void;
}

function valueColor(v: number): string {
  if (v >= 7.5) return '#10B981';
  if (v >= 4) return '#F59E0B';
  return '#EF4444';
}

export function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  const lastInt = React.useRef(Math.round(value));

  function handleChange(v: number) {
    const int = Math.round(v);
    if (int !== lastInt.current) {
      lastInt.current = int;
      Haptics.selectionAsync();
    }
    onChange(int);
  }

  const color = valueColor(value);

  return (
    <View className="flex-row items-center gap-2">
      <Slider
        style={{ flex: 1, height: 36 }}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={handleChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor={color}
      />
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: color + '22',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color, fontSize: 14, fontWeight: '700' }}>{value}</Text>
      </View>
    </View>
  );
}
