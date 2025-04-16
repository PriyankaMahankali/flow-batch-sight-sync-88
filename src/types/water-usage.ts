
export interface WaterUsageData {
  id: string;
  area: 'kitchen' | 'bathroom' | 'washing' | 'other';
  liters: number;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  totalUsage: number;
  badges: Badge[];
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface DailyConsumption {
  date: string;
  liters: number;
}

export interface AreaConsumption {
  area: string;
  current: number;
  previous: number;
  target: number;
}
