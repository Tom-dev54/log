import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useStore } from '../../src/store';
import { Button } from '../../src/components/ui/Button';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { ConfirmSheet } from '../../src/components/ui/ConfirmSheet';

export default function SettingsScreen() {
  const rubricNotes = useStore((s) => s.rubricNotes);
  const updateRubricNotes = useStore((s) => s.updateRubricNotes);
  const contents = useStore((s) => s.contents);
  const topics = useStore((s) => s.topics);

  const [notes, setNotes] = useState(rubricNotes);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(rubricNotes);
  }, [rubricNotes]);

  async function handleExport() {
    try {
      const data = JSON.stringify({ contents, topics, rubricNotes, exportedAt: new Date().toISOString() }, null, 2);
      const path = FileSystem.documentDirectory + 'xhs-retro-export.json';
      await FileSystem.writeAsStringAsync(path, data, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(path, { mimeType: 'application/json' });
    } catch {
      Alert.alert('导出失败', '无法导出数据，请重试');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">设置</Text>
        </View>

        {/* rubric notes */}
        <View className="mb-6">
          <SectionHeader title="评分标准备注" />
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 gap-3">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              记录你对 7 个维度的个性化理解，持续迭代复盘心得
            </Text>
            <TextInput
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-gray-900 dark:text-white text-sm"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              placeholder="例如：&#10;钩子力：前3秒必须有强烈疑问或反差&#10;传播性：能让人发给特定朋友才算高分..."
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              style={{ minHeight: 160 }}
            />
            <Button
              title={saved ? '已保存 ✓' : '保存备注'}
              variant={saved ? 'secondary' : 'primary'}
              onPress={() => {
                updateRubricNotes(notes);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
            />
          </View>
        </View>

        {/* data management */}
        <View className="mb-6">
          <SectionHeader title="数据管理" />
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 dark:text-gray-400">内容数量</Text>
              <Text className="text-sm font-bold text-gray-900 dark:text-white">{contents.length} 条</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 dark:text-gray-400">选题数量</Text>
              <Text className="text-sm font-bold text-gray-900 dark:text-white">{topics.length} 个</Text>
            </View>
            <View className="h-px bg-gray-100 dark:bg-gray-800" />
            <Button title="导出数据 (JSON)" variant="secondary" onPress={handleExport} />
            <Button
              title="清空所有数据"
              variant="destructive"
              onPress={() => setClearConfirm(true)}
            />
          </View>
        </View>

        {/* about */}
        <View className="mb-6">
          <SectionHeader title="关于" />
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 gap-2">
            <Text className="text-sm text-gray-600 dark:text-gray-400">小红书 Vlog 复盘</Text>
            <Text className="text-sm text-gray-400">版本 1.0.0</Text>
            <Text className="text-xs text-gray-400 mt-1">
              参考 XBuilderLAB/cheat-on-content 设计，帮助内容创作者建立数据驱动的复盘习惯
            </Text>
          </View>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={clearConfirm}
        title="清空所有数据"
        message="此操作将删除所有内容、选题和设置，无法恢复！"
        confirmLabel="确认清空"
        destructive
        onConfirm={() => {
          useStore.setState({ contents: [], topics: [], rubricNotes: '' });
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </SafeAreaView>
  );
}
