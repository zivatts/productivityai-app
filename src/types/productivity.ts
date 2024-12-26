export interface TaskEntry {
  id: number;
  taskName: string;
  timeSpent: number;
  completionOrder: number;
  method: string;
  energyLevel: 'Low' | 'Medium' | 'High';
  category?: 'Development' | 'Communication' | 'Planning' | 'Research' | 'Administrative';
  priority?: 'Low' | 'Medium' | 'High';
  timestamp: number;
  feedback?: TaskFeedback;
}

export interface TaskPattern {
  type: 'time' | 'energy' | 'category';
  data: Record<string, any>;
  insights: string[];
}

export interface TaskAnalysis {
  patterns: TaskPattern[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: 'time' | 'method' | 'sequence' | 'energy' | 'batch' | 'automation' | 'delegation';
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  category?: string;
  actionItems?: string[];
  confidence: number;
}

export interface UserPreferences {
  workStartTime: string;
  workEndTime: string;
  preferredTaskCategories: string[];
  energyPeakHours: number[];
  toolIntegrations: ToolIntegration[];
}

export interface ToolIntegration {
  type: 'calendar' | 'projectManagement' | 'communication';
  name: string;
  enabled: boolean;
  settings: Record<string, any>;
}

export interface TaskFeedback {
  accurateTimeEstimate: boolean;
  effectiveEnergyLevel: boolean;
  helpfulSuggestions: boolean;
  comments?: string;
}

export interface AIFeedback {
  recommendationId: string;
  helpful: boolean;
  implemented: boolean;
  impact: 'Low' | 'Medium' | 'High';
  comments?: string;
}