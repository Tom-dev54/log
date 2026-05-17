import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { AppTextInput } from '../../src/components/ui/AppTextInput';
import { Button } from '../../src/components/ui/Button';

export default function NewContentScreen() {
  const router = useRouter();
  const createContent = useStore((s) => s.createContent);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  function handleCreate() {
    if (!title.trim()) {
      setErrors({ title: '请输入内容标题' });
      return;
    }
    const id = createContent(title.trim(), topic.trim());
    router.replace({ pathname: '/content/[id]', params: { id } });
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-6">
          新建内容进入创作流程：打分 → 预测 → 发布 → 复盘
        </Text>
        <View className="gap-4">
          <AppTextInput
            label="内容标题 *"
            placeholder="例如：为什么年轻人开始「反消费」"
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              setErrors({});
            }}
            error={errors.title}
            autoFocus
            returnKeyType="next"
          />
          <AppTextInput
            label="话题标签"
            placeholder="例如：消费观、生活方式"
            value={topic}
            onChangeText={setTopic}
            returnKeyType="done"
          />
        </View>
      </ScrollView>
      <View className="px-4 pb-6 pt-4 gap-3">
        <Button title="创建内容" onPress={handleCreate} disabled={!title.trim()} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
