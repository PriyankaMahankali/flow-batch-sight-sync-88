
import { fetchWaterUsageData } from "./water-usage";
import type { DailyConsumption, AreaConsumption } from "@/types/water-usage";

export async function fetchDailyConsumption(userId: string): Promise<DailyConsumption[]> {
  try {
    const waterUsageData = await fetchWaterUsageData(userId);
    
    const consumptionByDate = waterUsageData.reduce((acc, item) => {
      const date = item.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.liters;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(consumptionByDate)
      .map(date => ({
        date,
        liters: consumptionByDate[date]
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Error fetching daily consumption:", error);
    return [];
  }
}

export async function fetchAreaConsumption(userId: string): Promise<AreaConsumption[]> {
  try {
    const waterUsageData = await fetchWaterUsageData(userId);
    
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);
    
    const currentPeriodData: Record<string, number> = {};
    const previousPeriodData: Record<string, number> = {};
    
    waterUsageData.forEach(item => {
      const itemDate = new Date(item.date);
      const area = item.area;
      
      if (itemDate >= sevenDaysAgo && itemDate <= now) {
        if (!currentPeriodData[area]) {
          currentPeriodData[area] = 0;
        }
        currentPeriodData[area] += item.liters;
      } else if (itemDate >= fourteenDaysAgo && itemDate < sevenDaysAgo) {
        if (!previousPeriodData[area]) {
          previousPeriodData[area] = 0;
        }
        previousPeriodData[area] += item.liters;
      }
    });
    
    const areas = ['kitchen', 'bathroom', 'washing', 'other'];
    const targets = {
      kitchen: 100,
      bathroom: 150,
      washing: 120,
      other: 80
    };
    
    return areas.map(area => ({
      area,
      current: Math.round(currentPeriodData[area] || 0),
      previous: Math.round(previousPeriodData[area] || 0),
      target: targets[area as keyof typeof targets]
    }));
  } catch (error) {
    console.error("Error fetching area consumption:", error);
    return [];
  }
}

export async function getTodayUsage(userId: string): Promise<number> {
  try {
    const waterUsageData = await fetchWaterUsageData(userId);
    
    const today = new Date().toISOString().split('T')[0];
    
    return waterUsageData
      .filter(item => item.date.startsWith(today))
      .reduce((sum, item) => sum + item.liters, 0);
  } catch (error) {
    console.error("Error fetching today's usage:", error);
    return 0;
  }
}
