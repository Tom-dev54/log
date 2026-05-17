import { ContentScore } from '../store/types';
import { SCORE_WEIGHTS, ScoreDimensionKey } from './constants';

export function computeTotal(dims: Omit<ContentScore, 'total' | 'notes'>): number {
  let total = 0;
  for (const key of Object.keys(SCORE_WEIGHTS) as ScoreDimensionKey[]) {
    total += dims[key] * SCORE_WEIGHTS[key];
  }
  return Math.round(total * 10) / 10;
}

export function scoreColor(total: number): string {
  if (total >= 7.5) return '#10B981';
  if (total >= 5) return '#F59E0B';
  return '#EF4444';
}
