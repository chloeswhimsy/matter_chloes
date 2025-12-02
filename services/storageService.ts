import { AppState, Goal } from "../types";
import { LANDSCAPES } from "../constants";

const STORAGE_KEY = 'forest_of_intent_data_v1';

export const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: AppState = {
  goals: [],
  streak: 0,
  lastActiveDate: '',
  unlockedLandscapes: [LANDSCAPES[0].id],
  currentLandscapeId: LANDSCAPES[0].id,
  inventory: [],
  giftsReceivedThisMonth: 0,
  lastGiftMonth: '',
};

export const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;
    
    const parsed = JSON.parse(saved);
    const today = getTodayString();
    
    // Migration: Ensure all goals have a date and migrate 'Calmness'/'Leisure' to 'Health'
    const goalsWithDate = Array.isArray(parsed.goals) 
      ? parsed.goals.map((g: any) => ({
          ...g,
          date: g.date || parsed.lastActiveDate || today,
          category: (g.category === 'Calmness' || g.category === 'Leisure') ? 'Health' : g.category
        }))
      : [];

    return {
      ...parsed,
      goals: goalsWithDate,
    };
  } catch (e) {
    console.error("Failed to load state", e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};