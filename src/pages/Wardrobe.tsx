import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ClothingGrid from '@/components/ClothingGrid';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Footprints, Layers, Filter } from "lucide-react";

const Wardrobe = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    document.title = 'My Wardrobe | Wardrobify';
    
    // Fetch distinct categories if user is logged in
    if (user) {
      const fetchCategories = async () => {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('category')
          .eq('user_id', user.id)
          .order('category');
        
        if (!error && data) {
          // Extract unique categories
          const uniqueCategories = [...new Set(data.map(item => item.category))];
          setCategories(uniqueCategories);
        }
      };
      
      fetchCategories();
    }
  }, [user]);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }

  // Helper function to get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tops':
      case 'shirts':
        return <Shirt size={16} />;
      case 'bottoms':
      case 'pants':
      case 'trousers':
        return <Shirt size={16} />; // Using Shirt since Pants is not available
      case 'shoes':
      case 'footwear':
        return <Footprints size={16} />;
      default:
        return <Layers size={16} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wardrobe</h1>
      
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Filter size={16} />
              All Items
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex items-center gap-1"
              >
                {getCategoryIcon(category)}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <ClothingGrid categoryFilter={null} />
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <ClothingGrid categoryFilter={category} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Wardrobe;
