
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ClothingGrid from '@/components/ClothingGrid';
import ColorMatchingAssistant from '@/components/ColorMatchingAssistant';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Footprints, Layers, Filter, ShoppingBag, Palette } from "lucide-react";

const Wardrobe = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showColorAssistant, setShowColorAssistant] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Predefined main categories
  const mainCategories = [
    { id: "all", name: "All Items", icon: <Filter size={16} /> },
    { id: "Tops", name: "Shirts", icon: <Shirt size={16} /> },
    { id: "Bottoms", name: "Pants", icon: <Layers size={16} /> },
    { id: "Shoes", name: "Shoes", icon: <Footprints size={16} /> },
    { id: "Accessories", name: "Accessories", icon: <ShoppingBag size={16} /> },
  ];
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wardrobe</h1>
        <button 
          onClick={() => setShowColorAssistant(!showColorAssistant)}
          className="flex items-center gap-2 text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors"
        >
          <Palette size={16} />
          {showColorAssistant ? 'Hide Color Assistant' : 'Color Matching Assistant'}
        </button>
      </div>
      
      {showColorAssistant && (
        <div className="mb-6">
          <ColorMatchingAssistant />
        </div>
      )}
      
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap">
            {mainCategories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <ClothingGrid categoryFilter={null} />
          </TabsContent>
          
          {mainCategories.slice(1).map(category => (
            <TabsContent key={category.id} value={category.id}>
              <ClothingGrid categoryFilter={category.id} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Wardrobe;
