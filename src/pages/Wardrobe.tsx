
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ClothingGrid from '@/components/ClothingGrid';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Footprints, Layers, Filter, ShoppingBag, PlusCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const Wardrobe = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Predefined main categories
  const mainCategories = [
    { id: "Tops", name: "Shirts", icon: <Shirt size={20} />, color: "bg-blue-100" },
    { id: "Bottoms", name: "Pants", icon: <Layers size={20} />, color: "bg-green-100" },
    { id: "Shoes", name: "Shoes", icon: <Footprints size={20} />, color: "bg-amber-100" },
    { id: "Accessories", name: "Accessories", icon: <ShoppingBag size={20} />, color: "bg-purple-100" },
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

  const handleAddItem = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAddModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wardrobe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCategories.map(category => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className={`${category.color} py-4`}>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full h-8 w-8 p-0" 
                  onClick={() => handleAddItem(category.id)}
                >
                  <PlusCircle size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto">
              <ClothingGrid 
                categoryFilter={category.id} 
                showAddButton={false}
                selectedCategory={selectedCategory}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
