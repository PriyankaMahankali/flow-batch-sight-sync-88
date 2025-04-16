
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLeaderboard } from '@/data/mock-data';
import { Award, Droplet, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@/types/water-usage';

export function LeaderboardDisplay() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from a database
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div 
              key={user.id} 
              className="flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <div className="mr-3 text-lg font-semibold w-6 text-center">
                {index + 1}
              </div>
              
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <UserIcon className="h-5 w-5 text-water-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Droplet className="h-3 w-3 mr-1 text-water-500" />
                  {user.totalUsage} liters
                </div>
              </div>
              
              <div className="flex items-center">
                {user.badges.length > 0 && (
                  <div className="flex -space-x-1.5">
                    {user.badges.slice(0, 2).map((badge, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                    ))}
                    {user.badges.length > 2 && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        +{user.badges.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
