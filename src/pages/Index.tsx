
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { WaterUsageSummary } from '@/components/dashboard/WaterUsageSummary';
import { AreaAnalysis } from '@/components/dashboard/AreaAnalysis';
import { WaterUsageChart } from '@/components/dashboard/WaterUsageChart';
import { BadgeDisplay } from '@/components/badges/BadgeDisplay';
import { LeaderboardDisplay } from '@/components/leaderboard/LeaderboardDisplay';
import { initializeFirebaseWithSampleData, getCurrentUserFromFirebase } from '@/lib/firebase';
import { User } from '@/types/water-usage';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initData = async () => {
      try {
        // Initialize Firebase with sample data if needed
        await initializeFirebaseWithSampleData();
        
        // Get current user
        const user = await getCurrentUserFromFirebase();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-lg">Loading application data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome, {currentUser.name}</h1>
          <p className="text-muted-foreground">
            Track your water usage and conservation efforts
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WaterUsageSummary />
          <AreaAnalysis />
        </div>
        
        <div className="mb-6">
          <WaterUsageChart />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardDisplay />
          <BadgeDisplay />
        </div>
      </div>
    </div>
  );
};

export default Index;
