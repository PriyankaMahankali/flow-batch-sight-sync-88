
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { currentUserId, fetchUser, ref, update, getDatabase } from '@/lib/firebase';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dailyTarget, setDailyTarget] = useState(150);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = await fetchUser(currentUserId);
        if (user) {
          setUsername(user.name || 'John Doe');
          setEmail(user.email || 'john.doe@example.com');
          setDailyTarget(user.dailyTarget || 150);
          setNotifications(user.preferences?.notifications !== false);
          setDarkMode(user.preferences?.darkMode || false);
          setDataSharing(user.preferences?.dataSharing !== false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${currentUserId}`);
      
      // Update user profile data
      await update(userRef, {
        name: username,
        email: email,
        dailyTarget: dailyTarget
      });
      
      toast.success('Profile settings saved successfully!');
    } catch (error) {
      console.error('Error saving profile settings:', error);
      toast.error('Failed to save profile settings');
    }
  };

  const handleSavePreferences = async () => {
    try {
      const database = getDatabase();
      const userPreferencesRef = ref(database, `users/${currentUserId}/preferences`);
      
      // Update user preferences
      await update(userPreferencesRef, {
        notifications: notifications,
        darkMode: darkMode,
        dataSharing: dataSharing
      });
      
      toast.success('App preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Display Name</Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-target">Daily Water Target (liters)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="water-target"
                      min={50}
                      max={300}
                      step={10}
                      value={[dailyTarget]}
                      onValueChange={(value) => setDailyTarget(value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{dailyTarget}L</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about your water usage
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the application
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share anonymous usage data to improve the app
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={dataSharing}
                    onCheckedChange={setDataSharing}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePreferences}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
