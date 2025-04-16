
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserBadges, currentUserId } from '@/lib/firebase';
import { Award, Droplet, Shield } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userBadges = await fetchUserBadges(currentUserId);
        setBadges(userBadges);
      } catch (error) {
        console.error("Failed to fetch user badges:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Badges Earned</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">Loading badges...</div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
