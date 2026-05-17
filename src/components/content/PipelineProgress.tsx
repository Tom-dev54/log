import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentStatus } from '../../store/types';
import { STATUS_CONFIG } from '../../utils/constants';

const STEPS: { status: ContentStatus; label: string }[] = [
  { status: 'draft', label: '草稿' },
  { status: 'scored', label: '打分' },
  { status: 'predicted', label: '预测' },
  { status: 'published', label: '发布' },
  { status: 'retro_done', label: '复盘' },
];

export function PipelineProgress({ status }: { status: ContentStatus }) {
  const currentStep = STATUS_CONFIG[status].step;

  return (
    <View className="flex-row items-center">
      {STEPS.map((step, i) => {
        const cfg = STATUS_CONFIG[step.status];
        const done = cfg.step < currentStep;
        const active = cfg.step === currentStep;
        const color = done || active ? cfg.color : '#D1D5DB';

        return (
          <React.Fragment key={step.status}>
            <View className="items-center gap-1" style={{ flex: 1 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: done ? color : active ? color + '22' : '#F3F4F6',
                  borderWidth: active ? 2 : 0,
                  borderColor: color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: active ? color : '#D1D5DB',
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: done || active ? color : '#9CA3AF',
                  fontWeight: active ? '700' : '400',
                }}
              >
                {step.label}
              </Text>
            </View>
            {i < STEPS.length - 1 ? (
              <View
                style={{
                  height: 2,
                  flex: 0.5,
                  backgroundColor: done ? color : '#E5E7EB',
                  marginBottom: 18,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}
