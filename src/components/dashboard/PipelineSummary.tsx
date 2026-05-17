import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ContentStatus } from '../../store/types';
import { STATUS_CONFIG } from '../../utils/constants';

interface PipelineSummaryProps {
  counts: Record<ContentStatus, number>;
  onPress: (status: ContentStatus) => void;
}

const ITEMS: { status: ContentStatus }[] = [
  { status: 'draft' },
  { status: 'scored' },
  { status: 'predicted' },
  { status: 'published' },
  { status: 'retro_done' },
];

export function PipelineSummary({ counts, onPress }: PipelineSummaryProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
      {ITEMS.map((item, i) => {
        const cfg = STATUS_CONFIG[item.status];
        return (
          <Pressable
            key={item.status}
            onPress={() => onPress(item.status)}
            style={{
              backgroundColor: cfg.color + '15',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              minWidth: 88,
              marginLeft: i === 0 ? 0 : 10,
            }}
          >
            <Text style={{ color: cfg.color, fontSize: 28, fontWeight: '800' }}>
              {counts[item.status]}
            </Text>
            <Text style={{ color: cfg.color, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
              {cfg.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
