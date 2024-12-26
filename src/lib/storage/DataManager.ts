import { TaskEntry, UserPreferences, AIFeedback } from '@/types/productivity';

export class DataManager {
  private static readonly STORAGE_KEYS = {
    TASKS: 'productivity_tasks',
    PREFERENCES: 'user_preferences',
    FEEDBACK: 'ai_feedback',
    TASK_HISTORY: 'task_history',
  };

  // Task Management
  static async saveTasks(tasks: TaskEntry[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      await this.updateTaskHistory(tasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw new Error('Failed to save tasks');
    }
  }

  static getTasks(): TaskEntry[] {
    try {
      const tasks = localStorage.getItem(this.STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  // Task History for AI Learning
  private static async updateTaskHistory(currentTasks: TaskEntry[]): Promise<void> {
    try {
      const history = this.getTaskHistory();
      const updatedHistory = [...history, ...currentTasks].slice(-100); // Keep last 100 tasks
      localStorage.setItem(this.STORAGE_KEYS.TASK_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error updating task history:', error);
    }
  }

  static getTaskHistory(): TaskEntry[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEYS.TASK_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading task history:', error);
      return [];
    }
  }

  // User Preferences
  static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  static getPreferences(): UserPreferences | null {
    try {
      const prefs = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  }

  // AI Feedback Management
  static saveFeedback(feedback: AIFeedback): void {
    try {
      const existingFeedback = this.getFeedback();
      const updatedFeedback = [...existingFeedback, feedback];
      localStorage.setItem(this.STORAGE_KEYS.FEEDBACK, JSON.stringify(updatedFeedback));
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw new Error('Failed to save feedback');
    }
  }

  static getFeedback(): AIFeedback[] {
    try {
      const feedback = localStorage.getItem(this.STORAGE_KEYS.FEEDBACK);
      return feedback ? JSON.parse(feedback) : [];
    } catch (error) {
      console.error('Error loading feedback:', error);
      return [];
    }
  }
}