
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyConsumption, getAreaConsumption } from '@/data/mock-data';
import { useEffect, useState } from 'react';
import { AreaConsumption, DailyConsumption } from '@/types/water-usage';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TrendsPage = () => {
  const [dailyData, setDailyData] = useState<DailyConsumption[]>([]);
  const [areaData, setAreaData] = useState<AreaConsumption[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from a database
    setDailyData(getDailyConsumption());
    setAreaData(getAreaConsumption());
  }, []);

  const formattedDailyData = dailyData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const pieData = areaData.map(({ area, current }) => ({
    name: area,
    value: current
  }));

  const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'];

  const weeklyTotal = dailyData.reduce((acc, curr) => acc + curr.liters, 0);
  const weeklyAverage = Math.round(weeklyTotal / dailyData.length);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Water Usage Trends</h1>
          <p className="text-muted-foreground">
            Analyze your water consumption patterns over time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Weekly Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-water-600">{weeklyAverage} L</div>
              <p className="text-sm text-muted-foreground">per day</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Weekly Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-water-600">{weeklyTotal} L</div>
              <p className="text-sm text-muted-foreground">last 7 days</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[80px]">
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} liters`, '']}
                      labelFormatter={(index) => pieData[index as number]?.name || ''}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Consumption Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="line">Line Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bar" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedDailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={[0, 'dataMax + 20']}
                      label={{ value: 'Liters', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} liters`, 'Consumption']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="liters" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="line" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedDailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={[0, 'dataMax + 20']}
                      label={{ value: 'Liters', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} liters`, 'Consumption']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="liters" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Area Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={areaData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" label={{ value: 'Liters', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="area" type="category" width={80} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'previous') return [`${value} liters`, 'Previous'];
                      if (name === 'current') return [`${value} liters`, 'Current'];
                      if (name === 'target') return [`${value} liters`, 'Target'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Area: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="previous" fill="#94a3b8" name="Previous" />
                  <Bar dataKey="current" fill="#0ea5e9" name="Current" />
                  <Bar dataKey="target" fill="#34d399" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsPage;
