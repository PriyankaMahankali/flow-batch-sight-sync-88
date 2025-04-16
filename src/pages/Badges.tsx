
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserBadges, mockBadges } from '@/data/mock-data';
import { Award, Calendar, Droplet, LockIcon, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/types/water-usage';

const BadgeIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'droplet':
      return <Droplet className="h-8 w-8 text-water-600" />;
    case 'award':
      return <Award className="h-8 w-8 text-amber-500" />;
    default:
      return <Shield className="h-8 w-8 text-green-600" />;
  }
};

const BadgesPage = () => {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  
  useEffect(() => {
    // In a real app, these would come from a database
    const earned = getUserBadges('1');
    setEarnedBadges(earned);
    
    // Find badges not yet earned
    const available = mockBadges.filter(
      badge => !earned.some(eb => eb.id === badge.id)
    );
    setAvailableBadges(available);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Badges</h1>
          <p className="text-muted-foreground">
            Track your achievements and conservation milestones
          </p>
        </div>
        
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {earnedBadges.length ? (
                earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg bg-secondary/30">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-3">
                      <BadgeIcon icon={badge.icon} />
                    </div>
                    <span className="text-base font-medium mb-1">{badge.name}</span>
                    <span className="text-xs text-muted-foreground mb-2">{badge.description}</span>
                    {badge.earnedAt && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No badges earned yet. Save water to earn badges!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Available Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableBadges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center p-4 border rounded-lg bg-gray-100/50">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 relative">
                    <div className="absolute inset-0 rounded-full bg-gray-200/80 flex items-center justify-center">
                      <LockIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <span className="text-base font-medium mb-1">{badge.name}</span>
                  <span className="text-xs text-muted-foreground">{badge.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BadgesPage;
