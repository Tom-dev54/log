import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppState,
  ContentItem,
  ContentScore,
  Prediction,
  ActualMetrics,
  Retrospective,
  TopicIdea,
} from './types';
import { generateId } from '../utils/id';
import { now } from '../utils/date';
import { computeTotal } from '../utils/scoring';
import { computeAccuracy } from '../utils/accuracy';
import { STORAGE_KEY } from '../lib/storage';

interface Actions {
  // lifecycle
  createContent: (title: string, topic: string) => string;
  updateContent: (id: string, patch: Partial<Pick<ContentItem, 'title' | 'topic'>>) => void;
  deleteContent: (id: string) => void;
  saveScore: (id: string, dims: Omit<ContentScore, 'total'>) => void;
  lockPrediction: (id: string, data: Omit<Prediction, 'lockedAt'>) => void;
  markPublished: (id: string, publishedAt: string) => void;
  saveRetro: (id: string, retro: Omit<Retrospective, 'predictionAccuracy' | 'completedAt'>, actual: Omit<ActualMetrics, 'recordedAt'>) => void;

  // topics
  createTopic: (data: Omit<TopicIdea, 'id' | 'createdAt'>) => string;
  updateTopic: (id: string, patch: Partial<Omit<TopicIdea, 'id' | 'createdAt'>>) => void;
  deleteTopic: (id: string) => void;
  promoteTopicToContent: (topicId: string) => string;

  // settings
  updateRubricNotes: (notes: string) => void;
  completeOnboarding: () => void;
}

type Store = AppState & Actions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      contents: [],
      topics: [],
      rubricNotes: '',
      onboardingDone: false,
      isHydrated: false,

      createContent(title, topic) {
        const id = generateId();
        const ts = now();
        set((s) => ({
          contents: [
            ...s.contents,
            { id, title, topic, status: 'draft', createdAt: ts, updatedAt: ts },
          ],
        }));
        return id;
      },

      updateContent(id, patch) {
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now() } : c
          ),
        }));
      },

      deleteContent(id) {
        set((s) => ({ contents: s.contents.filter((c) => c.id !== id) }));
      },

      saveScore(id, dims) {
        const total = computeTotal(dims);
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id
              ? { ...c, score: { ...dims, total }, status: 'scored', updatedAt: now() }
              : c
          ),
        }));
      },

      lockPrediction(id, data) {
        const item = get().contents.find((c) => c.id === id);
        if (!item || item.prediction) return;
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id
              ? {
                  ...c,
                  prediction: { ...data, lockedAt: now() },
                  status: 'predicted',
                  updatedAt: now(),
                }
              : c
          ),
        }));
      },

      markPublished(id, publishedAt) {
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id
              ? { ...c, publishedAt, status: 'published', updatedAt: now() }
              : c
          ),
        }));
      },

      saveRetro(id, retro, actual) {
        const item = get().contents.find((c) => c.id === id);
        if (!item?.prediction) return;
        const actualMetrics: ActualMetrics = { ...actual, recordedAt: now() };
        const predictionAccuracy = computeAccuracy(item.prediction, actualMetrics);
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id
              ? {
                  ...c,
                  actualMetrics,
                  retrospective: { ...retro, predictionAccuracy, completedAt: now() },
                  status: 'retro_done',
                  updatedAt: now(),
                }
              : c
          ),
        }));
      },

      createTopic(data) {
        const id = generateId();
        set((s) => ({
          topics: [...s.topics, { id, ...data, createdAt: now() }],
        }));
        return id;
      },

      updateTopic(id, patch) {
        set((s) => ({
          topics: s.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },

      deleteTopic(id) {
        set((s) => ({ topics: s.topics.filter((t) => t.id !== id) }));
      },

      promoteTopicToContent(topicId) {
        const topic = get().topics.find((t) => t.id === topicId);
        if (!topic) return '';
        const contentId = get().createContent(topic.title, topic.title);
        get().deleteTopic(topicId);
        return contentId;
      },

      updateRubricNotes(notes) {
        set({ rubricNotes: notes });
      },

      completeOnboarding() {
        set({ onboardingDone: true });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        contents: s.contents,
        topics: s.topics,
        rubricNotes: s.rubricNotes,
        onboardingDone: s.onboardingDone,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
