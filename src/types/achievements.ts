export interface Achievement {
  id: string;
  gameType: string;
  title: string;
  description: string;
  target: number;
  type: 'moves' | 'time' | 'completion' | 'streak';
  icon: string;
  completed: boolean;
  completedAt?: Date;
  progress?: number;
}

export interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
}</parameter>