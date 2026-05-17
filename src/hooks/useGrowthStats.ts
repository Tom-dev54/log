import { useStore } from '../store';
import {
  selectAccuracyHistory,
  selectAverageScore,
  selectScoreHistory,
} from '../store/selectors';

export function useGrowthStats() {
  const contents = useStore((s) => s.contents);
  const retroDone = contents.filter((c) => c.status === 'retro_done');
  const accuracyHistory = selectAccuracyHistory(contents);
  const avgAccuracy =
    accuracyHistory.length > 0
      ? Math.round(
          accuracyHistory.reduce((s, x) => s + x.accuracy, 0) / accuracyHistory.length
        )
      : 0;
  const bestAccuracy =
    accuracyHistory.length > 0
      ? Math.max(...accuracyHistory.map((x) => x.accuracy))
      : 0;

  return {
    totalPublished: contents.filter((c) => ['published', 'retro_done'].includes(c.status)).length,
    totalRetros: retroDone.length,
    avgAccuracy,
    bestAccuracy,
    avgScore: selectAverageScore(contents),
    accuracyHistory,
    scoreHistory: selectScoreHistory(contents),
  };
}
