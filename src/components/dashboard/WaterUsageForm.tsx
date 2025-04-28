
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { emitWaterConsumed } from '@/lib/events';
import { addWaterUsageData, currentUserId } from '@/lib/firebase';

export function WaterUsageForm() {
  const [area, setArea] = useState<'kitchen' | 'bathroom' | 'washing' | 'other'>('kitchen');
  const [liters, setLiters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (liters <= 0) {
      toast.error("Please enter a valid water amount");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to database
      const date = new Date().toISOString();
      const newEntry = { area, liters, date, userId: currentUserId };
      const entryId = await addWaterUsageData(newEntry);
      
      if (entryId) {
        // Emit the water consumed event
        emitWaterConsumed({
          area,
          liters,
          userId: currentUserId
        });
        
        toast.success("Water usage recorded successfully");
        setLiters(0); // Reset input
      }
    } catch (error) {
      console.error("Error recording water usage:", error);
      toast.error("Failed to record water usage");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Record Water Usage</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Select 
              value={area} 
              onValueChange={(value) => setArea(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="washing">Washing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liters">Water Amount (liters)</Label>
            <Input
              id="liters"
              type="number"
              min="0"
              step="0.5"
              value={liters || ''}
              onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount in liters"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || liters <= 0}
          >
            {isSubmitting ? "Recording..." : "Record Water Usage"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
