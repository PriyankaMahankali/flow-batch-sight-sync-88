
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAreaConsumption, currentUserId } from '@/lib/firebase';
import { AreaConsumption } from '@/types/water-usage';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export function AreaAnalysis() {
  const [areaData, setAreaData] = useState<AreaConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const areas = await fetchAreaConsumption(currentUserId);
        setAreaData(areas);
      } catch (error) {
        console.error("Failed to fetch area consumption:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getChangePercent = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Usage Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="py-8 text-center">Loading data...</div>
        ) : (
          areaData.map((area) => (
            <div key={area.area} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{area.area}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{area.current}L</span>
                  {area.current < area.previous ? (
                    <span className="text-xs flex items-center text-green-600">
                      <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                      {Math.abs(getChangePercent(area.current, area.previous))}%
                    </span>
                  ) : (
                    <span className="text-xs flex items-center text-red-600">
                      <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                      {getChangePercent(area.current, area.previous)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    area.current <= area.target ? 'bg-green-500' : 'bg-water-500'
                  }`} 
                  style={{ width: `${Math.min(100, (area.current / area.target) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Previous: {area.previous}L</span>
                <span>Target: {area.target}L</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
