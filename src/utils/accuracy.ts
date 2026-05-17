import { ActualMetrics, Prediction } from '../store/types';

function metricAccuracy(predicted: number, actual: number): number {
  if (actual === 0 && predicted === 0) return 100;
  if (actual === 0) return 0;
  return Math.max(0, 100 - (Math.abs(predicted - actual) / actual) * 100);
}

export function computeAccuracy(prediction: Prediction, actual: ActualMetrics): number {
  const weights = { views: 0.4, collects: 0.3, likes: 0.2, comments: 0.1 };
  const score =
    metricAccuracy(prediction.predictedViews, actual.views) * weights.views +
    metricAccuracy(prediction.predictedCollects, actual.collects) * weights.collects +
    metricAccuracy(prediction.predictedLikes, actual.likes) * weights.likes +
    metricAccuracy(prediction.predictedComments, actual.comments) * weights.comments;
  return Math.round(score);
}

export function accuracyColor(pct: number): string {
  if (pct >= 80) return '#10B981';
  if (pct >= 60) return '#F59E0B';
  return '#EF4444';
}
