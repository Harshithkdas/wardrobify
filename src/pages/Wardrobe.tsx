
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shirt, Footprints, Layers, ShoppingBag } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const Wardrobe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Predefined main categories
  const mainCategories = [
    { id: "Tops", name: "Shirts", icon: <Shirt size={24} />, color: "bg-blue-100", path: "/wardrobe/shirts" },
    { id: "Bottoms", name: "Pants", icon: <Layers size={24} />, color: "bg-green-100", path: "/wardrobe/pants" },
    { id: "Shoes", name: "Shoes", icon: <Footprints size={24} />, color: "bg-amber-100", path: "/wardrobe/shoes" },
    { id: "Accessories", name: "Accessories", icon: <ShoppingBag size={24} />, color: "bg-purple-100", path: "/wardrobe/accessories" },
  ];
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wardrobe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCategories.map(category => (
          <Card 
            key={category.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(category.path)}
          >
            <CardHeader className={`${category.color} py-6`}>
              <div className="flex justify-center">
                {category.icon}
              </div>
              <CardTitle className="text-center text-xl mt-2">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-center">
                View and manage your {category.name.toLowerCase()}
              </CardDescription>
              <div className="flex justify-center mt-4">
                <Button onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${category.path}?add=true`);
                }}>
                  Add New {category.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
