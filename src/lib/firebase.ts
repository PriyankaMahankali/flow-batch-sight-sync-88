import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, update, remove, onValue, off } from "firebase/database";
import type { WaterUsageData, User, Badge, DailyConsumption, AreaConsumption } from "@/types/water-usage";

// Firebase configuration
const firebaseConfig = {
  databaseURL: "https://realtimeproject-12671-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export these functions for use in other components
export { ref, update, getDatabase };

// Water usage data functions
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

// User functions
export async function fetchUser(userId: string): Promise<User | null> {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return {
        id: userId,
        ...snapshot.val()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Badge functions
export async function fetchUserBadges(userId: string): Promise<Badge[]> {
  try {
    const userBadgesRef = ref(database, `userBadges/${userId}`);
    const badgesRef = ref(database, 'badges');
    
    const userBadgesSnapshot = await get(userBadgesRef);
    const badgesSnapshot = await get(badgesRef);
    
    if (!userBadgesSnapshot.exists() || !badgesSnapshot.exists()) {
      return [];
    }
    
    const userBadgeIds = Object.keys(userBadgesSnapshot.val());
    const allBadges = badgesSnapshot.val();
    
    return userBadgeIds.map(badgeId => ({
      id: badgeId,
      ...allBadges[badgeId],
      earnedAt: userBadgesSnapshot.val()[badgeId].earnedAt
    }));
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }
}

export async function fetchAllBadges(): Promise<Badge[]> {
  try {
    const badgesRef = ref(database, 'badges');
    const snapshot = await get(badgesRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
}

// Consumption data functions
export async function fetchDailyConsumption(userId: string): Promise<DailyConsumption[]> {
  try {
    const waterUsageData = await fetchWaterUsageData(userId);
    
    // Group by date and sum liters
    const consumptionByDate = waterUsageData.reduce((acc, item) => {
      const date = item.date.split('T')[0]; // Get just the date part
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.liters;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array and sort by date
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
    
    // Get the current date and 7 days ago for comparison
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);
    
    // Group data by area and period (current week vs previous week)
    const currentPeriodData: Record<string, number> = {};
    const previousPeriodData: Record<string, number> = {};
    
    waterUsageData.forEach(item => {
      const itemDate = new Date(item.date);
      const area = item.area;
      
      if (itemDate >= sevenDaysAgo && itemDate <= now) {
        // Current period (last 7 days)
        if (!currentPeriodData[area]) {
          currentPeriodData[area] = 0;
        }
        currentPeriodData[area] += item.liters;
      } else if (itemDate >= fourteenDaysAgo && itemDate < sevenDaysAgo) {
        // Previous period (7-14 days ago)
        if (!previousPeriodData[area]) {
          previousPeriodData[area] = 0;
        }
        previousPeriodData[area] += item.liters;
      }
    });
    
    // Generate results for all areas
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

// Get today's water usage
export async function getTodayUsage(userId: string): Promise<number> {
  try {
    const waterUsageData = await fetchWaterUsageData(userId);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Filter and sum today's usage
    return waterUsageData
      .filter(item => item.date.startsWith(today))
      .reduce((sum, item) => sum + item.liters, 0);
  } catch (error) {
    console.error("Error fetching today's usage:", error);
    return 0;
  }
}

// New function to listen to water usage data in real-time
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
  
  // Return function to unsubscribe
  return () => off(waterUsageRef);
}

// Initialize Firebase with sample data if needed
export async function initializeFirebaseWithSampleData() {
  try {
    // Check if data already exists
    const rootRef = ref(database);
    const snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    
    // Sample users
    const users = {
      "1": {
        name: "John Doe",
        totalUsage: 450,
        badges: [],
        avatar: null
      },
      "2": {
        name: "Jane Smith",
        totalUsage: 380,
        badges: [],
        avatar: null
      },
      "3": {
        name: "Mark Wilson",
        totalUsage: 520,
        badges: [],
        avatar: null
      }
    };
    
    // Sample badges
    const badges = {
      "b1": {
        name: "Water Saver",
        description: "Reduced water usage by 20% for a week",
        icon: "droplet"
      },
      "b2": {
        name: "Conservation Champion",
        description: "Stayed under target for 30 days straight",
        icon: "award"
      },
      "b3": {
        name: "Eco Guardian",
        description: "Reduced bathroom usage by 30%",
        icon: "shield"
      }
    };
    
    // Sample user badges
    const userBadges = {
      "1": {
        "b1": { earnedAt: "2023-01-15T12:00:00Z" }
      },
      "2": {
        "b2": { earnedAt: "2023-01-20T14:30:00Z" }
      }
    };
    
    // Sample water usage data
    const waterUsage = {
      "w1": {
        area: "kitchen",
        liters: 45,
        date: "2023-01-14T08:30:00Z",
        userId: "1"
      },
      "w2": {
        area: "bathroom",
        liters: 65,
        date: "2023-01-14T18:45:00Z",
        userId: "1"
      },
      "w3": {
        area: "washing",
        liters: 120,
        date: "2023-01-15T10:15:00Z",
        userId: "1"
      },
      "w4": {
        area: "kitchen",
        liters: 38,
        date: "2023-01-13T09:20:00Z",
        userId: "1"
      },
      "w5": {
        area: "bathroom",
        liters: 58,
        date: "2023-01-12T19:30:00Z",
        userId: "1"
      },
      "w6": {
        area: "other",
        liters: 25,
        date: "2023-01-11T14:00:00Z",
        userId: "1"
      }
    };
    
    // Write sample data to the database
    await set(ref(database, 'users'), users);
    await set(ref(database, 'badges'), badges);
    await set(ref(database, 'userBadges'), userBadges);
    await set(ref(database, 'WaterConsumed'), waterUsage);
    
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Export a default currentUser for the app to use
export const currentUserId = "1";

// Export a default function to get the current user
export const getCurrentUserFromFirebase = async () => {
  const user = await fetchUser(currentUserId);
  return user || { id: currentUserId, name: "John Doe", totalUsage: 0, badges: [] };
};
