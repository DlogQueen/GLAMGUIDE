"use client";

type TutorialHistoryItem = {
  styleId: string;
  styleName: string;
  completedAt: string; // ISO
};

const HISTORY_KEY = "glam_guide_tutorial_history_v1";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export const betaLocal = {
  getTutorialHistory(): TutorialHistoryItem[] {
    if (typeof window === "undefined") return [];
    const parsed = safeParse<TutorialHistoryItem[]>(window.localStorage.getItem(HISTORY_KEY));
    return Array.isArray(parsed) ? parsed : [];
  },

  addTutorialHistory(item: TutorialHistoryItem) {
    if (typeof window === "undefined") return;
    const current = betaLocal.getTutorialHistory();
    const next = [item, ...current].slice(0, 200);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  },

  clearTutorialHistory() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(HISTORY_KEY);
  },
};

