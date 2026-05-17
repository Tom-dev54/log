import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { ScoreDimension } from '../../../src/components/content/ScoreDimension';
import { AppTextInput } from '../../../src/components/ui/AppTextInput';
import { Button } from '../../../src/components/ui/Button';
import { SCORE_DIMENSIONS } from '../../../src/utils/constants';
import { computeTotal, scoreColor } from '../../../src/utils/scoring';
import { ContentScore } from '../../../src/store/types';

type Dims = Omit<ContentScore, 'total' | 'notes'>;

const DEFAULT_DIMS: Dims = {
  hook: 5,
  value: 5,
  visual: 5,
  sharing: 5,
  persona: 5,
  timing: 5,
  execution: 5,
};

export default function ScoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useStore((s) => s.contents.find((c) => c.id === id));
  const saveScore = useStore((s) => s.saveScore);

  const [dims, setDims] = useState<Dims>(
    item?.score ? { ...DEFAULT_DIMS, ...item.score } : DEFAULT_DIMS
  );
  const [notes, setNotes] = useState(item?.score?.notes ?? '');

  const total = computeTotal(dims);
  const color = scoreColor(total);

  function handleSave() {
    saveScore(id, { ...dims, notes });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView
        className="flex-1 px-4 pt-2"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* total bar */}
        <View
          className="rounded-2xl p-4 mb-5 flex-row items-center justify-between"
          style={{ backgroundColor: color + '18' }}
        >
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">综合得分</Text>
            <Text style={{ fontSize: 42, fontWeight: '800', color }}>{total}</Text>
          </View>
          <Text style={{ fontSize: 20, color: color + 'AA' }}>/10</Text>
        </View>

        {SCORE_DIMENSIONS.map((dim) => (
          <ScoreDimension
            key={dim.key}
            label={dim.label}
            desc={dim.desc}
            value={dims[dim.key]}
            onChange={(v) => setDims((d) => ({ ...d, [dim.key]: v }))}
          />
        ))}

        <AppTextInput
          label="打分备注"
          placeholder="记录你对这篇内容的综合感受..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 80 }}
        />
      </ScrollView>

      <View className="px-4 pb-6 pt-2 gap-3">
        <Button title="保存打分" onPress={handleSave} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
