
import { AreaConsumption, Badge, DailyConsumption, User, WaterUsageData } from '@/types/water-usage';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Water Saver',
    description: 'Saved 100 liters of water',
    icon: 'droplet',
    earnedAt: '2025-04-10',
  },
  {
    id: '2',
    name: 'Efficiency Expert',
    description: 'Reduced water usage by 20%',
    icon: 'award',
    earnedAt: '2025-04-05',
  },
  {
    id: '3',
    name: 'Eco Warrior',
    description: 'Maintained optimal water usage for 30 days',
    icon: 'award',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    totalUsage: 120,
    badges: [mockBadges[0], mockBadges[1]],
  },
  {
    id: '2',
    name: 'Sam Rivera',
    totalUsage: 145,
    badges: [mockBadges[0]],
  },
  {
    id: '3',
    name: 'Taylor Kim',
    totalUsage: 170,
    badges: [],
  },
  {
    id: '4',
    name: 'Jordan Smith',
    totalUsage: 190,
    badges: [mockBadges[0]],
  },
];

export const mockWaterUsageData: WaterUsageData[] = [
  { id: '1', area: 'kitchen', liters: 45, date: '2025-04-15', userId: '1' },
  { id: '2', area: 'bathroom', liters: 35, date: '2025-04-15', userId: '1' },
  { id: '3', area: 'washing', liters: 40, date: '2025-04-15', userId: '1' },
  { id: '4', area: 'kitchen', liters: 50, date: '2025-04-14', userId: '1' },
  { id: '5', area: 'bathroom', liters: 40, date: '2025-04-14', userId: '1' },
  { id: '6', area: 'washing', liters: 45, date: '2025-04-14', userId: '1' },
];

export const mockDailyConsumption: DailyConsumption[] = [
  { date: '2025-04-10', liters: 135 },
  { date: '2025-04-11', liters: 140 },
  { date: '2025-04-12', liters: 125 },
  { date: '2025-04-13', liters: 130 },
  { date: '2025-04-14', liters: 135 },
  { date: '2025-04-15', liters: 120 },
  { date: '2025-04-16', liters: 125 },
];

export const mockAreaConsumption: AreaConsumption[] = [
  { area: 'Kitchen', current: 45, previous: 50, target: 40 },
  { area: 'Bathroom', current: 35, previous: 40, target: 30 },
  { area: 'Washing', current: 40, previous: 45, target: 35 },
  { area: 'Other', current: 0, previous: 10, target: 5 },
];

export const getCurrentUser = (): User => {
  return mockUsers[0];
};

export const getLeaderboard = (): User[] => {
  return [...mockUsers].sort((a, b) => a.totalUsage - b.totalUsage);
};

export const getTodayUsage = (): number => {
  return mockWaterUsageData
    .filter(usage => usage.date === '2025-04-16')
    .reduce((total, usage) => total + usage.liters, 0) || 120;
};

export const getAreaConsumption = (): AreaConsumption[] => {
  return mockAreaConsumption;
};

export const getDailyConsumption = (): DailyConsumption[] => {
  return mockDailyConsumption;
};

export const getUserBadges = (userId: string): Badge[] => {
  const user = mockUsers.find(u => u.id === userId);
  return user?.badges || [];
};
