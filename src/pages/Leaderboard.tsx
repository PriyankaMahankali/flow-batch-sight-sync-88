
import { Sidebar } from '@/components/sidebar/Sidebar';
import { LeaderboardDisplay } from '@/components/leaderboard/LeaderboardDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLeaderboard } from '@/data/mock-data';
import { Award, Droplet, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@/types/water-usage';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from a database
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who's using water most efficiently
          </p>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Top Water Savers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center p-3 rounded-md ${
                    index === 0 ? 'bg-amber-50 border border-amber-200' : 
                    index === 1 ? 'bg-slate-50 border border-slate-200' : 
                    index === 2 ? 'bg-orange-50 border border-orange-200' : 
                    'hover:bg-secondary/50'
                  } transition-colors`}
                >
                  <div className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-amber-500 text-white' : 
                    index === 1 ? 'bg-slate-400 text-white' : 
                    index === 2 ? 'bg-orange-700 text-white' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <UserIcon className="h-6 w-6 text-water-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Droplet className="h-4 w-4 mr-1 text-water-500" />
                      {user.totalUsage} liters consumed
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {user.badges.length > 0 && (
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-amber-500 mr-1" />
                        <span className="text-sm">{user.badges.length} badges</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Most Improved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-water-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Taylor Kim</div>
                    <div className="text-xs text-muted-foreground">Reduced usage by 20%</div>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-water-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Alex Johnson</div>
                    <div className="text-xs text-muted-foreground">Reduced usage by 15%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Badge Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard
                  .sort((a, b) => b.badges.length - a.badges.length)
                  .slice(0, 3)
                  .map((user) => (
                    <div key={user.id} className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-water-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.badges.length} badges earned</div>
                      </div>
                      <div className="flex">
                        {user.badges.slice(0, 2).map((badge, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center -mr-1">
                            <Award className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
