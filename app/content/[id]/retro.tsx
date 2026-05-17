import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../src/store';
import { PredictionCard } from '../../../src/components/content/PredictionCard';
import { MetricsComparison } from '../../../src/components/content/MetricsComparison';
import { AccuracyBadge } from '../../../src/components/content/AccuracyBadge';
import { AppTextInput } from '../../../src/components/ui/AppTextInput';
import { Button } from '../../../src/components/ui/Button';
import { SectionHeader } from '../../../src/components/ui/SectionHeader';
import { computeAccuracy } from '../../../src/utils/accuracy';
import { ActualMetrics } from '../../../src/store/types';

const METRIC_INPUTS = [
  { key: 'views', label: '实际浏览量', placeholder: '12800' },
  { key: 'collects', label: '实际收藏数', placeholder: '620' },
  { key: 'likes', label: '实际点赞数', placeholder: '380' },
  { key: 'comments', label: '实际评论数', placeholder: '42' },
] as const;

export default function RetroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useStore((s) => s.contents.find((c) => c.id === id));
  const saveRetro = useStore((s) => s.saveRetro);

  const [actuals, setActuals] = useState({
    views: '',
    collects: '',
    likes: '',
    comments: '',
  });
  const [whatWorked, setWhatWorked] = useState('');
  const [whatFailed, setWhatFailed] = useState('');
  const [keyInsight, setKeyInsight] = useState('');
  const [rubricNote, setRubricNote] = useState('');
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  if (!item?.prediction) return null;

  const allFilled = METRIC_INPUTS.every((m) => actuals[m.key].trim() !== '' && !isNaN(parseInt(actuals[m.key])));

  const previewActuals: ActualMetrics | null = allFilled
    ? {
        views: parseInt(actuals.views),
        collects: parseInt(actuals.collects),
        likes: parseInt(actuals.likes),
        comments: parseInt(actuals.comments),
        recordedAt: new Date().toISOString(),
      }
    : null;

  const previewAccuracy =
    previewActuals ? computeAccuracy(item.prediction, previewActuals) : null;

  function validate() {
    const e: typeof errors = {};
    for (const m of METRIC_INPUTS) {
      const v = parseInt(actuals[m.key]);
      if (isNaN(v) || v < 0) e[m.key] = '请输入有效数字';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    saveRetro(
      id,
      { whatWorked, whatFailed, keyInsight, rubricNote },
      {
        views: parseInt(actuals.views),
        collects: parseInt(actuals.collects),
        likes: parseInt(actuals.likes),
        comments: parseInt(actuals.comments),
      }
    );
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView
        className="flex-1 px-4 pt-2"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* locked prediction */}
        <View className="mb-5">
          <SectionHeader title="当时的预测" />
          <PredictionCard prediction={item.prediction} />
        </View>

        {/* actual inputs */}
        <View className="mb-5">
          <SectionHeader title="实际数据" />
          <View className="gap-3">
            {METRIC_INPUTS.map((m) => (
              <AppTextInput
                key={m.key}
                label={m.label}
                placeholder={m.placeholder}
                value={actuals[m.key]}
                onChangeText={(v) => {
                  setActuals((p) => ({ ...p, [m.key]: v }));
                  setErrors((e) => ({ ...e, [m.key]: undefined }));
                }}
                error={errors[m.key]}
                keyboardType="number-pad"
                returnKeyType="next"
              />
            ))}
          </View>
        </View>

        {/* live comparison */}
        {previewActuals && previewAccuracy !== null && (
          <View className="mb-5">
            <SectionHeader title="预测 vs 实际" />
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 gap-4">
              <View className="items-center">
                <AccuracyBadge accuracy={previewAccuracy} />
              </View>
              <MetricsComparison prediction={item.prediction} actual={previewActuals} />
            </View>
          </View>
        )}

        {/* insight fields */}
        <View className="gap-4 mb-5">
          <SectionHeader title="复盘洞察" />
          <AppTextInput
            label="哪些做对了"
            placeholder="这次内容表现好的地方..."
            value={whatWorked}
            onChangeText={setWhatWorked}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
          <AppTextInput
            label="哪些做错了"
            placeholder="这次内容不足的地方..."
            value={whatFailed}
            onChangeText={setWhatFailed}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
          <AppTextInput
            label="关键洞察"
            placeholder="这次复盘最重要的一个发现..."
            value={keyInsight}
            onChangeText={setKeyInsight}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
          <AppTextInput
            label="评分标准调整（可选）"
            placeholder="这次复盘是否要更新你的打分标准？..."
            value={rubricNote}
            onChangeText={setRubricNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 gap-3">
        <Button
          title="完成复盘"
          onPress={handleSave}
          disabled={!allFilled}
        />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
