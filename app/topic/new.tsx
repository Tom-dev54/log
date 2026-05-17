import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { AppTextInput } from '../../src/components/ui/AppTextInput';
import { Button } from '../../src/components/ui/Button';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { TopicIdea } from '../../src/store/types';

export default function NewTopicScreen() {
  const router = useRouter();
  const createTopic = useStore((s) => s.createTopic);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [priority, setPriority] = useState<TopicIdea['priority']>('normal');
  const [error, setError] = useState('');

  function handleCreate() {
    if (!title.trim()) {
      setError('请输入选题标题');
      return;
    }
    createTopic({
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(/[,，\s]+/).map((t) => t.trim()).filter(Boolean),
      priority,
    });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        <View className="gap-4">
          <AppTextInput
            label="选题标题 *"
            placeholder="例如：职场人的周末解压指南"
            value={title}
            onChangeText={(v) => { setTitle(v); setError(''); }}
            error={error}
            autoFocus
          />
          <AppTextInput
            label="选题描述"
            placeholder="简单描述这个选题的思路..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
          <AppTextInput
            label="标签（逗号或空格分隔）"
            placeholder="职场、生活方式、周末"
            value={tags}
            onChangeText={setTags}
          />
          <View>
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">优先级</Text>
            <SegmentedControl
              options={[
                { value: 'hot', label: '热门' },
                { value: 'normal', label: '普通' },
                { value: 'low', label: '低优' },
              ]}
              value={priority}
              onChange={setPriority}
            />
          </View>
        </View>
      </ScrollView>
      <View className="px-4 pb-6 pt-4 gap-3">
        <Button title="添加选题" onPress={handleCreate} disabled={!title.trim()} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
