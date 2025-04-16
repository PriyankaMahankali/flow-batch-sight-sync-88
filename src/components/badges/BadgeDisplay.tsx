
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserBadges } from '@/data/mock-data';
import { Award, Droplet, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/types/water-usage';

const BadgeIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'droplet':
      return <Droplet className="h-7 w-7 text-water-600" />;
    case 'award':
      return <Award className="h-7 w-7 text-amber-500" />;
    default:
      return <Shield className="h-7 w-7 text-green-600" />;
  }
};

export function BadgeDisplay() {
  const [badges, setBadges] = useState<Badge[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from a database
    setBadges(getUserBadges('1'));
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Badges Earned</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 justify-between">
          {badges.length ? (
            badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2">
                  <BadgeIcon icon={badge.icon} />
                </div>
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-muted-foreground py-4">
              No badges earned yet. Save water to earn badges!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
