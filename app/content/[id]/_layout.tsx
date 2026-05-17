import React from 'react';
import { Stack } from 'expo-router';

export default function ContentDetailLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '内容详情', headerBackTitle: '返回' }} />
      <Stack.Screen name="score" options={{ title: '内容打分', headerBackTitle: '返回' }} />
      <Stack.Screen name="predict" options={{ title: '盲测预测', headerBackTitle: '返回' }} />
      <Stack.Screen name="publish" options={{ title: '记录发布', headerBackTitle: '返回' }} />
      <Stack.Screen name="retro" options={{ title: '开始复盘', headerBackTitle: '返回' }} />
    </Stack>
  );
}
