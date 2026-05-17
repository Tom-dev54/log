import { ContentItem, ContentStatus } from './types';
import { daysSince } from '../utils/date';

export function selectByStatus(contents: ContentItem[], status: ContentStatus) {
  return contents.filter((c) => c.status === status);
}

export function selectRetroReady(contents: ContentItem[]) {
  return contents.filter(
    (c) => c.status === 'published' && c.publishedAt && daysSince(c.publishedAt) >= 3
  );
}

export function selectPipelineCounts(contents: ContentItem[]) {
  return {
    draft: contents.filter((c) => c.status === 'draft').length,
    scored: contents.filter((c) => c.status === 'scored').length,
    predicted: contents.filter((c) => c.status === 'predicted').length,
    published: contents.filter((c) => c.status === 'published').length,
    retro_done: contents.filter((c) => c.status === 'retro_done').length,
  };
}

export function selectAccuracyHistory(contents: ContentItem[]) {
  return contents
    .filter((c) => c.retrospective)
    .sort((a, b) => new Date(a.retrospective!.completedAt).getTime() - new Date(b.retrospective!.completedAt).getTime())
    .map((c) => ({
      date: c.retrospective!.completedAt.split('T')[0],
      accuracy: c.retrospective!.predictionAccuracy,
      label: c.title.slice(0, 6),
    }));
}

export function selectAverageScore(contents: ContentItem[]) {
  const scored = contents.filter((c) => c.score);
  if (!scored.length) return 0;
  const sum = scored.reduce((acc, c) => acc + (c.score?.total ?? 0), 0);
  return Math.round((sum / scored.length) * 10) / 10;
}

export function selectScoreHistory(contents: ContentItem[]) {
  return contents
    .filter((c) => c.score)
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    .map((c) => ({
      date: c.updatedAt.split('T')[0],
      score: c.score!.total,
      label: c.title.slice(0, 6),
    }));
}
