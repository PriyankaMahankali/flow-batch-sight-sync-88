
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyConsumption } from '@/data/mock-data';
import { DailyConsumption } from '@/types/water-usage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WaterUsageChart() {
  const [data, setData] = useState<DailyConsumption[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from a database
    setData(getDailyConsumption());
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
      </CardContent>
    </Card>
  );
}
