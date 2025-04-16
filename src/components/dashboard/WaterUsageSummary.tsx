
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplet } from 'lucide-react';
import { getTodayUsage } from '@/data/mock-data';

export function WaterUsageSummary() {
  const [usage, setUsage] = useState(0);
  const dailyTarget = 150; // Liters
  const percentUsed = Math.min(100, Math.round((usage / dailyTarget) * 100));
  
  useEffect(() => {
    // In a real app, this would come from a database
    setUsage(getTodayUsage());
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">Water Consumed Today</CardTitle>
            <CardDescription>You've used {usage} liters so far</CardDescription>
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
