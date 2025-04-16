
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDailyConsumption, currentUserId } from '@/lib/firebase';
import { DailyConsumption } from '@/types/water-usage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WaterUsageChart() {
  const [data, setData] = useState<DailyConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dailyData = await fetchDailyConsumption(currentUserId);
        setData(dailyData);
      } catch (error) {
        console.error("Failed to fetch daily consumption:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Water Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <p>Loading data...</p>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={[0, 'dataMax + 20']}
                  label={{ value: 'Liters', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }} 
                />
                <Tooltip 
                  formatter={(value) => [`${value} liters`, 'Consumption']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="liters" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
