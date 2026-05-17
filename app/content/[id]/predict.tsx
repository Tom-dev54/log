import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../../src/store';
import { AppTextInput } from '../../../src/components/ui/AppTextInput';
import { Button } from '../../../src/components/ui/Button';
import { SegmentedControl } from '../../../src/components/ui/SegmentedControl';
import { ConfirmSheet } from '../../../src/components/ui/ConfirmSheet';
import { Prediction } from '../../../src/store/types';

type Confidence = Prediction['confidence'];

const METRICS = [
  { key: 'predictedViews', label: '预测浏览量', placeholder: '10000' },
  { key: 'predictedCollects', label: '预测收藏数', placeholder: '500' },
  { key: 'predictedLikes', label: '预测点赞数', placeholder: '300' },
  { key: 'predictedComments', label: '预测评论数', placeholder: '50' },
] as const;

export default function PredictScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lockPrediction = useStore((s) => s.lockPrediction);

  const [values, setValues] = useState({
    predictedViews: '',
    predictedCollects: '',
    predictedLikes: '',
    predictedComments: '',
  });
  const [confidence, setConfidence] = useState<Confidence>('medium');
  const [reasoning, setReasoning] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function validate() {
    const e: typeof errors = {};
    for (const m of METRICS) {
      const v = parseInt(values[m.key]);
      if (isNaN(v) || v < 0) {
        e[m.key] = '请输入有效数字';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleLock() {
    if (!validate()) return;
    setConfirm(true);
  }

  function handleConfirmLock() {
    lockPrediction(id, {
      predictedViews: parseInt(values.predictedViews),
      predictedCollects: parseInt(values.predictedCollects),
      predictedLikes: parseInt(values.predictedLikes),
      predictedComments: parseInt(values.predictedComments),
      confidence,
      reasoning,
    });
    setConfirm(false);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView
        className="flex-1 px-4 pt-2"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* warning banner */}
        <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-5 flex-row items-center gap-3">
          <Ionicons name="lock-closed" size={20} color="#F59E0B" />
          <View className="flex-1">
            <Text className="text-amber-700 dark:text-amber-400 font-bold text-sm">
              保存后不可修改
            </Text>
            <Text className="text-amber-600 dark:text-amber-500 text-xs mt-0.5">
              盲测预测一旦锁定即永久不可编辑，请认真填写
            </Text>
          </View>
        </View>

        {/* metric inputs */}
        <View className="gap-4 mb-5">
          {METRICS.map((m) => (
            <AppTextInput
              key={m.key}
              label={m.label}
              placeholder={m.placeholder}
              value={values[m.key]}
              onChangeText={(v) => {
                setValues((prev) => ({ ...prev, [m.key]: v }));
                setErrors((e) => ({ ...e, [m.key]: undefined }));
              }}
              error={errors[m.key]}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          ))}
        </View>

        {/* confidence */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            置信度
          </Text>
          <SegmentedControl
            options={[
              { value: 'high', label: '高' },
              { value: 'medium', label: '中' },
              { value: 'low', label: '低' },
            ]}
            value={confidence}
            onChange={setConfidence}
          />
        </View>

        {/* reasoning */}
        <AppTextInput
          label="预测理由"
          placeholder="说明你预测的依据..."
          value={reasoning}
          onChangeText={setReasoning}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 80 }}
        />
      </ScrollView>

      <View className="px-4 pb-6 pt-2 gap-3">
        <Button title="锁定预测" onPress={handleLock} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>

      <ConfirmSheet
        visible={confirm}
        title="确认锁定预测？"
        message="锁定后永远无法修改或删除，只有复盘时才能对比实际数据。"
        confirmLabel="确认锁定"
        onConfirm={handleConfirmLock}
        onCancel={() => setConfirm(false)}
      />
    </SafeAreaView>
  );
}
