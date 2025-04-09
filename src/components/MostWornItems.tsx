
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Shirt, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type ClothingItem = Tables<'clothing_items'>;

interface WearCount {
  name: string;
  id: string;
  image: string;
  category: string;
  wearCount: number;
}

export function MostWornItems() {
  const { user } = useAuth();
  const [topItems, setTopItems] = useState<WearCount[]>([]);
  const [bottomItems, setBottomItems] = useState<WearCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate wear counts for demo purposes
  // In a real app, we would fetch this from a wear_counts table in Supabase
  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch clothing items
        const { data: clothingItems, error } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching clothing items:', error);
          return;
        }
        
        if (!clothingItems || clothingItems.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Simulate wear counts - in a real app this would come from tracking data
        const simulatedWearCounts: WearCount[] = clothingItems.map((item: ClothingItem) => {
          // Random number between 0 and 30 for demo purposes
          const randomWearCount = Math.floor(Math.random() * 31);
          
          return {
            id: item.id,
            name: item.name,
            image: item.image,
            category: item.category,
            wearCount: randomWearCount
          };
        });
        
        // Sort by wear count (descending)
        const sortedItems = simulatedWearCounts.sort((a, b) => b.wearCount - a.wearCount);
        
        // Get top 5 most worn
        setTopItems(sortedItems.slice(0, 5));
        
        // Get bottom 5 least worn (excluding unworn items)
        const wornItems = sortedItems.filter(item => item.wearCount > 0);
        setBottomItems(wornItems.slice(-5).reverse());
        
      } catch (error) {
        console.error('Error in fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, [user]);
  
  const renderItemCard = (item: WearCount) => (
    <Card key={item.id} className="overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-2 py-1 text-xs">
          Worn {item.wearCount} times
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.category}</p>
      </CardContent>
    </Card>
  );
  
  const chartData = topItems.map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    wears: item.wearCount
  }));

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (topItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
          <Shirt size={32} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No wear data available</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Start tracking when you wear your clothing items to see statistics here.
        </p>
        <Button>
          Add Clothing Items
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="most-worn">Most Worn</TabsTrigger>
          <TabsTrigger value="least-worn">Least Worn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Wear Distribution</CardTitle>
                <CardDescription>
                  How often you wear your top 5 most worn items
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Times Worn', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="wears" fill="#3b82f6" name="Times Worn" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wardrobe Insights</CardTitle>
                <CardDescription>
                  Key statistics about your wardrobe usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-amber-800">Unworn Items</h4>
                      <p className="text-sm text-amber-700">
                        You have {bottomItems.length === 0 ? "several" : bottomItems.filter(i => i.wearCount === 0).length} items that haven't been worn yet.
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Most Worn Category</h4>
                    <p className="text-sm text-gray-500">
                      Your {topItems[0]?.category || "Tops"} get the most use in your wardrobe.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Wardrobe Balance</h4>
                    <p className="text-sm text-gray-500">
                      Consider donating items you haven't worn in the past year to make room for new pieces.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="most-worn">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequently Worn Items</CardTitle>
              <CardDescription>
                These are the stars of your wardrobe that you wear most often
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topItems.map(renderItemCard)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="least-worn">
          <Card>
            <CardHeader>
              <CardTitle>Least Frequently Worn Items</CardTitle>
              <CardDescription>
                These items might need more attention or could be candidates for donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bottomItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {bottomItems.map(renderItemCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No data available for least worn items.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
