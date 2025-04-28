
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWaterConsumedListener } from '@/lib/events';
import { Droplet, Clock } from 'lucide-react';
import { WaterConsumptionEvent } from '@/lib/events';

type ConsumptionEvent = {
  id: string;
  area: string;
  liters: number;
  timestamp: Date;
};

export function WaterConsumptionListener() {
  const [events, setEvents] = useState<ConsumptionEvent[]>([]);
  
  const handleWaterConsumed = useCallback((event: WaterConsumptionEvent) => {
    const { area, liters } = event.detail;
    
    setEvents(prevEvents => [
      {
        id: Date.now().toString(),
        area,
        liters,
        timestamp: new Date()
      },
      ...prevEvents.slice(0, 4) // Keep only the 5 most recent events
    ]);
    
    // Log the event
    console.log('Water consumption detected:', event.detail);
  }, []);
  
  // Set up the listener
  useWaterConsumedListener(handleWaterConsumed);
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Droplet className="h-5 w-5 mr-2 text-water-600" />
          Recent Water Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No recent water usage recorded.
            <p className="text-sm mt-2">Use the form to record water consumption.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center p-2 bg-secondary/30 rounded-md">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-3">
                  <Droplet className="h-4 w-4 text-water-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {event.liters} liters used in {event.area}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
