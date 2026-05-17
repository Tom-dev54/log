import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../../src/store';
import { Button } from '../../../src/components/ui/Button';
import { toDateString } from '../../../src/utils/date';

export default function PublishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const markPublished = useStore((s) => s.markPublished);
  const [date] = useState(new Date());

  function handleConfirm() {
    markPublished(id, date.toISOString());
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <View className="flex-1 px-4 pt-6 gap-6">
        <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 items-center gap-4">
          <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center">
            <Ionicons name="paper-plane-outline" size={32} color="#3B82F6" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">记录发布</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
            确认你已将这条内容发布到小红书，发布时间将记录为今天
          </Text>

          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl px-6 py-4 w-full items-center">
            <Text className="text-sm text-gray-400 mb-1">发布日期</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {toDateString(date.toISOString()).replace(/-/g, '/')}
            </Text>
          </View>

          <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3 w-full">
            <Text className="text-xs text-orange-600 dark:text-orange-400 text-center">
              发布后 3 天即可开始复盘，届时会在看板收到提醒
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 pb-6 pt-2 gap-3">
        <Button title="确认已发布" onPress={handleConfirm} />
        <Button title="取消" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}
