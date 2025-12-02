export enum Category {
  Focus = 'Focus',
  Achievement = 'Achievement',
  Health = 'Health',
  Connection = 'Connection',
  Meaning = 'Meaning',
  Gratitude = 'Gratitude',
}

export interface Goal {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  reflection?: string;
  reflectionResponse?: string; // AI response
  completedAt?: string;
  date: string; // YYYY-MM-DD
}

export interface Landscape {
  id: string;
  name: string;
  description: string;
  colors: string[]; // Tailwind gradient classes or hex codes
}

export interface Gift {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  acquiredAt: string;
}

export interface AppState {
  goals: Goal[];
  streak: number;
  lastActiveDate: string;
  unlockedLandscapes: string[];
  currentLandscapeId: string;
  inventory: Gift[];
  giftsReceivedThisMonth: number;
  lastGiftMonth: string;
}