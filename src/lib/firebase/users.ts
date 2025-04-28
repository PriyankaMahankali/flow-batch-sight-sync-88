
import { ref, get } from "firebase/database";
import type { User } from "@/types/water-usage";
import { database } from "./config";

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
