import { TaskEntry, TaskAnalysis, TaskPattern, AIFeedback } from '@/types/productivity';

export class TaskAnalyzer {
  analyzeTaskPatterns(tasks: TaskEntry[]): TaskPattern[] {
    const patterns: TaskPattern[] = [];
    
    // Time patterns analysis
    const timePatterns = this.analyzeTimePatterns(tasks);
    if (timePatterns) patterns.push(timePatterns);
    
    // Energy level analysis
    const energyPatterns = this.analyzeEnergyPatterns(tasks);
    if (energyPatterns) patterns.push(energyPatterns);
    
    // Task complexity analysis
    const complexityPatterns = this.analyzeTaskComplexity(tasks);
    if (complexityPatterns) patterns.push(complexityPatterns);

    return patterns;
  }

  private analyzeTimePatterns(tasks: TaskEntry[]): TaskPattern {
    const tasksByCategory = this.groupByCategory(tasks);
    const patterns: Record<string, number> = {};
    const insights: string[] = [];

    for (const [category, categoryTasks] of Object.entries(tasksByCategory)) {
      const avgTime = this.calculateAverageTime(categoryTasks);
      patterns[category] = avgTime;

      // Generate insights based on time patterns
      if (avgTime > 120) { // Tasks taking more than 2 hours
        insights.push(`${category} tasks are taking longer than optimal. Consider breaking them into smaller subtasks.`);
      }
      
      // Detect time estimation accuracy
      const timeEstimationAccuracy = this.analyzeTimeEstimationAccuracy(categoryTasks);
      if (timeEstimationAccuracy < 0.7) {
        insights.push(`Time estimates for ${category} tasks are often inaccurate. Consider adding buffer time.`);
      }
    }

    return {
      type: 'time',
      data: patterns,
      insights,
    };
  }

  private analyzeTaskComplexity(tasks: TaskEntry[]): TaskPattern {
    const insights: string[] = [];
    const complexityData: Record<string, number> = {};

    tasks.forEach(task => {
      const complexity = this.calculateTaskComplexity(task);
      complexityData[task.category || 'Uncategorized'] = complexity;

      if (complexity > 0.8 && task.timeSpent > 90) {
        insights.push(`Consider breaking down "${task.taskName}" into smaller, manageable subtasks.`);
      }
    });

    return {
      type: 'complexity',
      data: complexityData,
      insights,
    };
  }

  private calculateTaskComplexity(task: TaskEntry): number {
    let complexity = 0;
    
    // Factor in time spent
    complexity += task.timeSpent > 120 ? 0.4 : task.timeSpent > 60 ? 0.2 : 0;
    
    // Factor in energy level
    complexity += task.energyLevel === 'High' ? 0.3 : task.energyLevel === 'Medium' ? 0.2 : 0.1;
    
    // Factor in priority
    complexity += task.priority === 'High' ? 0.3 : task.priority === 'Medium' ? 0.2 : 0.1;

    return complexity;
  }

  private analyzeTimeEstimationAccuracy(tasks: TaskEntry[]): number {
    const accuracyScores = tasks.map(task => {
      const estimatedTime = task.timeSpent; // In a real app, you'd compare with initial estimates
      const actualTime = task.timeSpent;
      return Math.min(estimatedTime, actualTime) / Math.max(estimatedTime, actualTime);
    });

    return accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length;
  }

  // ... (keep existing helper methods)
}