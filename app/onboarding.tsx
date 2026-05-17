import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../src/store';
import { Button } from '../src/components/ui/Button';

const STEPS = [
  {
    icon: 'star-outline' as const,
    title: '打分内容',
    desc: '从 7 个维度为每条 vlog 打分，建立你的评分体系',
    color: '#8B5CF6',
  },
  {
    icon: 'lock-closed-outline' as const,
    title: '盲测预测',
    desc: '发布前锁定你的预测，不允许事后修改，培养真实的判断力',
    color: '#F59E0B',
  },
  {
    icon: 'bar-chart-outline' as const,
    title: '发布复盘',
    desc: '发布 3 天后输入真实数据，对比预测，提炼创作洞察',
    color: '#10B981',
  },
  {
    icon: 'trending-up-outline' as const,
    title: '持续成长',
    desc: '准确率和打分趋势可视化，追踪你作为创作者的进步曲线',
    color: '#3B82F6',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      completeOnboarding();
      router.replace('/(tabs)');
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="flex-1 px-8 pt-12 pb-6 items-center">
        {/* logo area */}
        <View className="mb-8">
          <Text className="text-4xl font-black text-primary tracking-tight">小红书复盘</Text>
          <Text className="text-gray-400 text-center mt-1">内容创作者的数据驱动成长工具</Text>
        </View>

        {/* step indicator */}
        <View className="flex-row gap-2 mb-10">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i === step ? 'w-8' : 'w-2'}`}
              style={{ backgroundColor: i === step ? '#FF2D55' : '#E5E7EB' }}
            />
          ))}
        </View>

        {/* content */}
        <View className="flex-1 items-center justify-center gap-6">
          <View
            className="w-28 h-28 rounded-3xl items-center justify-center"
            style={{ backgroundColor: current.color + '20' }}
          >
            <Ionicons name={current.icon} size={56} color={current.color} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {current.title}
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center leading-6 px-4">
            {current.desc}
          </Text>
        </View>

        {/* actions */}
        <View className="w-full gap-3 mt-8">
          <Button title={isLast ? '开始使用' : '下一步'} onPress={handleNext} />
          {!isLast && (
            <Pressable
              onPress={() => {
                completeOnboarding();
                router.replace('/(tabs)');
              }}
            >
              <Text className="text-center text-gray-400 text-sm py-2">跳过引导</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
