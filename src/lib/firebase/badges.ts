
import { ref, get } from "firebase/database";
import type { Badge } from "@/types/water-usage";
import { database } from "./config";

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
