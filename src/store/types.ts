export type ContentStatus =
  | 'draft'
  | 'scored'
  | 'predicted'
  | 'published'
  | 'retro_done';

export interface ContentScore {
  hook: number;
  value: number;
  visual: number;
  sharing: number;
  persona: number;
  timing: number;
  execution: number;
  total: number;
  notes: string;
}

export interface Prediction {
  predictedLikes: number;
  predictedComments: number;
  predictedCollects: number;
  predictedViews: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  lockedAt: string;
}

export interface ActualMetrics {
  likes: number;
  comments: number;
  collects: number;
  views: number;
  recordedAt: string;
}

export interface Retrospective {
  predictionAccuracy: number;
  whatWorked: string;
  whatFailed: string;
  keyInsight: string;
  rubricNote: string;
  completedAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  topic: string;
  status: ContentStatus;
  score?: ContentScore;
  prediction?: Prediction;
  publishedAt?: string;
  actualMetrics?: ActualMetrics;
  retrospective?: Retrospective;
  createdAt: string;
  updatedAt: string;
}

export interface TopicIdea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: 'hot' | 'normal' | 'low';
  createdAt: string;
}

export interface AppState {
  contents: ContentItem[];
  topics: TopicIdea[];
  rubricNotes: string;
  onboardingDone: boolean;
  isHydrated: boolean;
}
