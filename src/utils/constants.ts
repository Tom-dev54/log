import { ContentStatus } from '../store/types';

export const SCORE_DIMENSIONS = [
  { key: 'hook', label: '钩子力', desc: 'Hook' },
  { key: 'value', label: '价值度', desc: 'Value' },
  { key: 'visual', label: '视觉感', desc: 'Visual' },
  { key: 'sharing', label: '传播性', desc: 'Sharing' },
  { key: 'persona', label: '人设感', desc: 'Persona' },
  { key: 'timing', label: '时机感', desc: 'Timing' },
  { key: 'execution', label: '执行力', desc: 'Execution' },
] as const;

export type ScoreDimensionKey = (typeof SCORE_DIMENSIONS)[number]['key'];

export const SCORE_WEIGHTS: Record<ScoreDimensionKey, number> = {
  hook: 0.2,
  value: 0.2,
  visual: 0.15,
  sharing: 0.15,
  persona: 0.1,
  timing: 0.1,
  execution: 0.1,
};

export const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; color: string; darkColor: string; step: number }
> = {
  draft: { label: '草稿', color: '#6B7280', darkColor: '#9CA3AF', step: 0 },
  scored: { label: '已打分', color: '#8B5CF6', darkColor: '#A78BFA', step: 1 },
  predicted: { label: '已预测', color: '#F59E0B', darkColor: '#FCD34D', step: 2 },
  published: { label: '已发布', color: '#3B82F6', darkColor: '#60A5FA', step: 3 },
  retro_done: { label: '已复盘', color: '#10B981', darkColor: '#34D399', step: 4 },
};

export const PRIMARY_COLOR = '#FF2D55';

export const METRICS_CONFIG = [
  { key: 'views', label: '浏览', icon: 'eye-outline', weight: 0.4 },
  { key: 'collects', label: '收藏', icon: 'bookmark-outline', weight: 0.3 },
  { key: 'likes', label: '点赞', icon: 'heart-outline', weight: 0.2 },
  { key: 'comments', label: '评论', icon: 'chatbubble-outline', weight: 0.1 },
] as const;

export type MetricKey = (typeof METRICS_CONFIG)[number]['key'];
