import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../src/store';
import { AppTextInput } from '../../src/components/ui/AppTextInput';
import { Button } from '../../src/components/ui/Button';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { ConfirmSheet } from '../../src/components/ui/ConfirmSheet';
import { TopicIdea } from '../../src/store/types';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const topic = useStore((s) => s.topics.find((t) => t.id === id));
  const updateTopic = useStore((s) => s.updateTopic);
  const deleteTopic = useStore((s) => s.deleteTopic);

  const [title, setTitle] = useState(topic?.title ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');
  const [tags, setTags] = useState(topic?.tags.join(', ') ?? '');
  const [priority, setPriority] = useState<TopicIdea['priority']>(topic?.priority ?? 'normal');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!topic) return null;

  function handleSave() {
    updateTopic(id, {
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
            label="选题标题"
            value={title}
            onChangeText={setTitle}
          />
          <AppTextInput
            label="选题描述"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 72 }}
          />
          <AppTextInput
            label="标签"
            value={tags}
            onChangeText={setTags}
            placeholder="逗号或空格分隔"
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
        <Button title="保存修改" onPress={handleSave} />
        <Button title="删除选题" variant="destructive" onPress={() => setDeleteConfirm(true)} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>

      <ConfirmSheet
        visible={deleteConfirm}
        title="删除选题"
        message="确认删除这条选题？"
        confirmLabel="删除"
        destructive
        onConfirm={() => {
          deleteTopic(id);
          setDeleteConfirm(false);
          router.back();
        }}
        onCancel={() => setDeleteConfirm(false)}
      />
    </SafeAreaView>
  );
}
