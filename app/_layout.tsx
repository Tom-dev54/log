import '../global.css';
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useStore } from '../src/store';

function OnboardingGuard() {
  const router = useRouter();
  const segments = useSegments();
  const onboardingDone = useStore((s) => s.onboardingDone);
  const isHydrated = useStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [isHydrated, onboardingDone, segments]);

  return null;
}

export default function RootLayout() {
  const isHydrated = useStore((s) => s.isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF2D55" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <OnboardingGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="content/new"
            options={{ presentation: 'modal', title: '新建内容', headerShown: true }}
          />
          <Stack.Screen
            name="content/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="topic/new"
            options={{ presentation: 'modal', title: '新建选题', headerShown: true }}
          />
          <Stack.Screen
            name="topic/[id]"
            options={{ title: '编辑选题', headerShown: true }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
