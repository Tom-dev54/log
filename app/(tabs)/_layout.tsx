import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../src/store';
import { selectRetroReady } from '../../src/store/selectors';

type IoniconsName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IoniconsName, focused: boolean, color: string) {
  return <Ionicons name={focused ? name : (`${name}-outline` as IoniconsName)} size={24} color={color} />;
}

export default function TabLayout() {
  const contents = useStore((s) => s.contents);
  const retroCount = selectRetroReady(contents).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF2D55',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '看板',
          tabBarIcon: ({ focused, color }) => tabIcon('grid', focused, color),
          tabBarBadge: retroCount > 0 ? retroCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#F97316' },
        }}
      />
      <Tabs.Screen
        name="contents"
        options={{
          title: '内容',
          tabBarIcon: ({ focused, color }) => tabIcon('list', focused, color),
        }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          title: '选题',
          tabBarIcon: ({ focused, color }) => tabIcon('bulb', focused, color),
        }}
      />
      <Tabs.Screen
        name="growth"
        options={{
          title: '成长',
          tabBarIcon: ({ focused, color }) => tabIcon('trending-up', focused, color),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ focused, color }) => tabIcon('settings', focused, color),
        }}
      />
    </Tabs>
  );
}
