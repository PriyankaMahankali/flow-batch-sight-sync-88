
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart3, ChevronLeft, ChevronRight, Droplet, Home, Medal, Settings, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, title, to, isActive }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 mb-1",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground"
        )}
      >
        {icon}
        <span>{title}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "h-screen sticky top-0 left-0 flex flex-col border-r bg-sidebar p-4 transition-all duration-300 bg-sidebar-background",
      collapsed ? "w-20" : "w-64",
    )}>
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-sidebar-foreground flex items-center">
            <Droplet className="mr-2 h-6 w-6 text-water-600" />
            <span>Water Tracker</span>
          </h2>
        )}
        {collapsed && <Droplet className="h-6 w-6 mx-auto text-water-600" />}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col space-y-1">
        <SidebarItem 
          icon={<Home className="h-5 w-5" />} 
          title="Home" 
          to="/" 
          isActive={location.pathname === '/'}
        />
        <SidebarItem 
          icon={<BarChart3 className="h-5 w-5" />} 
          title="Usage Trends" 
          to="/trends" 
          isActive={location.pathname === '/trends'}
        />
        <SidebarItem 
          icon={<Trophy className="h-5 w-5" />} 
          title="Leaderboard" 
          to="/leaderboard" 
          isActive={location.pathname === '/leaderboard'}
        />
        <SidebarItem 
          icon={<Medal className="h-5 w-5" />} 
          title="Badges" 
          to="/badges" 
          isActive={location.pathname === '/badges'}
        />
        <SidebarItem 
          icon={<Settings className="h-5 w-5" />} 
          title="Settings" 
          to="/settings" 
          isActive={location.pathname === '/settings'}
        />
      </div>

      <div className="mt-auto">
        <h3 className={cn(
          "text-sidebar-foreground/70 font-medium mb-2",
          collapsed ? "text-center text-xs" : "text-sm"
        )}>
          {collapsed ? "Analysis" : "Water Usage Analysis"}
        </h3>
        
        <div className="space-y-3">
          {['Kitchen', 'Bathroom', 'Washing'].map((area) => (
            <div key={area} className="flex flex-col">
              <div className="flex justify-between mb-1">
                {!collapsed && <span className="text-xs text-sidebar-foreground">{area}</span>}
                {collapsed && <span className="text-xs text-sidebar-foreground w-full text-center">{area.charAt(0)}</span>}
                {!collapsed && <span className="text-xs text-sidebar-foreground">45L</span>}
              </div>
              <div className="w-full bg-sidebar-border rounded-full h-1.5">
                <div className="bg-water-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
