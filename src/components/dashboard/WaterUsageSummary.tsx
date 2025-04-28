import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplet } from 'lucide-react';
import { subscribeToWaterUsageData, currentUserId, fetchUser } from '@/lib/firebase';

export function WaterUsageSummary() {
  const [usage, setUsage] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(150);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Get user's daily target setting
    fetchUser(currentUserId).then(user => {
      if (user?.dailyTarget) {
        setDailyTarget(user.dailyTarget);
      }
    });
    
    // Subscribe to real-time water usage updates
    const today = new Date().toISOString().split('T')[0];
    const unsubscribe = subscribeToWaterUsageData(currentUserId, (waterUsageData) => {
      // Calculate today's usage
      const todayUsage = waterUsageData
        .filter(item => item.date.startsWith(today))
        .reduce((sum, item) => sum + item.liters, 0);
      
      setUsage(todayUsage);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const percentUsed = Math.min(100, Math.round((usage / dailyTarget) * 100));
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">Water Consumed Today</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : `You've used ${usage} liters so far`}
            </CardDescription>
          </div>
          <Droplet className="h-8 w-8 text-water-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{usage} liters</span>
            <span>Daily target: {dailyTarget} liters</span>
          </div>
          <Progress value={percentUsed} className="h-2" />
          <div className="text-right text-sm text-muted-foreground">
            {dailyTarget - usage > 0 
              ? `${dailyTarget - usage} liters remaining` 
              : 'Target exceeded'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
