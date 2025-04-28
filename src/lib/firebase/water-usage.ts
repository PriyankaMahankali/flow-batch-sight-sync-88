
import { ref, get, set, push, onValue, off } from "firebase/database";
import type { WaterUsageData } from "@/types/water-usage";
import { database } from "./config";

export async function fetchWaterUsageData(userId: string): Promise<WaterUsageData[]> {
  try {
    const waterUsageRef = ref(database, 'WaterConsumed');
    const snapshot = await get(waterUsageRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key]
        }))
        .filter(item => item.userId === userId);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching water usage data:", error);
    return [];
  }
}

export async function addWaterUsageData(data: Omit<WaterUsageData, "id">): Promise<string | null> {
  try {
    const waterUsageRef = ref(database, 'WaterConsumed');
    const newDataRef = push(waterUsageRef);
    await set(newDataRef, data);
    return newDataRef.key;
  } catch (error) {
    console.error("Error adding water usage data:", error);
    return null;
  }
}

export function subscribeToWaterUsageData(userId: string, callback: (data: WaterUsageData[]) => void) {
  const waterUsageRef = ref(database, 'WaterConsumed');
  
  const listener = onValue(waterUsageRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const userWaterData = Object.keys(data)
        .map(key => ({
          id: key,
          ...data[key]
        }))
        .filter(item => item.userId === userId);
      
      callback(userWaterData);
    } else {
      callback([]);
    }
  });
  
  return () => off(waterUsageRef);
}
