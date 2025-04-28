
import { ref, set } from "firebase/database";
import { database } from "./config";
import { fetchUser } from "./users";

export async function initializeFirebaseWithSampleData() {
  try {
    const rootRef = ref(database);
    const snapshot = await get(rootRef);
    
    if (snapshot.exists()) {
      console.log("Database already has data, skipping initialization");
      return;
    }
    
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
    
    const userBadges = {
      "1": {
        "b1": { earnedAt: "2023-01-15T12:00:00Z" }
      },
      "2": {
        "b2": { earnedAt: "2023-01-20T14:30:00Z" }
      }
    };
    
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
    
    await set(ref(database, 'users'), users);
    await set(ref(database, 'badges'), badges);
    await set(ref(database, 'userBadges'), userBadges);
    await set(ref(database, 'WaterConsumed'), waterUsage);
    
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export const currentUserId = "1";

export const getCurrentUserFromFirebase = async () => {
  const user = await fetchUser(currentUserId);
  return user || { id: currentUserId, name: "John Doe", totalUsage: 0, badges: [] };
};
