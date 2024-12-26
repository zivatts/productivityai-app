import { TaskEntry, UserPreferences, AIFeedback } from '@/types/productivity';

const STORAGE_KEYS = {
  TASKS: 'productivity_tasks',
  PREFERENCES: 'user_preferences',
  FEEDBACK: 'ai_feedback',
} as const;

export class LocalStorageManager {
  static saveTasks(tasks: TaskEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  static getTasks(): TaskEntry[] {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  }

  static savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }

  static getPreferences(): UserPreferences | null {
    const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : null;
  }

  static saveFeedback(feedback: AIFeedback[]): void {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
  }

  static getFeedback(): AIFeedback[] {
    const feedback = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    return feedback ? JSON.parse(feedback) : [];
  }
}