import { useState, useCallback, useEffect } from 'react';
import { TaskEntry, Recommendation, UserPreferences, AIFeedback } from '@/types/productivity';
import { DataManager } from '@/lib/storage/DataManager';
import { TaskAnalyzer } from '@/lib/ai/TaskAnalyzer';
import { useToast } from '@/hooks/use-toast';

export function useProductivityEngine() {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const analyzer = new TaskAnalyzer();

  // Load initial data
  useEffect(() => {
    const loadedTasks = DataManager.getTasks();
    const loadedPreferences = DataManager.getPreferences();
    setTasks(loadedTasks);
    setPreferences(loadedPreferences);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    DataManager.saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((task: Omit<TaskEntry, 'id' | 'timestamp'>) => {
    const newTask: TaskEntry = {
      ...task,
      id: Date.now(),
      timestamp: Date.now(),
    };

    setTasks(prev => [...prev, newTask]);
    generateRecommendations([...tasks, newTask]);
  }, [tasks]);

  const updateTask = useCallback((id: number, updates: Partial<TaskEntry>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const addTaskFeedback = useCallback((taskId: number, feedback: AIFeedback) => {
    DataManager.saveFeedback(feedback);
    updateTask(taskId, { feedback: feedback.comments });
    
    toast({
      title: "Feedback Recorded",
      description: "Thank you! This helps improve our recommendations.",
    });
  }, [updateTask, toast]);

  const generateRecommendations = useCallback((currentTasks: TaskEntry[]) => {
    setIsLoading(true);
    try {
      const patterns = analyzer.analyzeTaskPatterns(currentTasks);
      const taskHistory = DataManager.getTaskHistory();
      
      // Generate personalized recommendations based on patterns and history
      const newRecommendations = patterns.map(pattern => ({
        type: pattern.type,
        description: pattern.insights[0] || 'No specific insights available',
        impact: 'Medium' as const,
        actionItems: pattern.insights,
        confidence: 0.8,
      }));
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [analyzer, toast]);

  return {
    tasks,
    recommendations,
    preferences,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    addTaskFeedback,
    generateRecommendations,
  };
}