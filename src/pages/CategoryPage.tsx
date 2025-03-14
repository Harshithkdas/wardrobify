
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import ClothingGrid from '@/components/ClothingGrid';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Map URL paths to category IDs
const categoryMap: Record<string, string> = {
  'shirts': 'Tops',
  'pants': 'Bottoms',
  'shoes': 'Shoes',
  'accessories': 'Accessories'
};

// Map category IDs to display names
const categoryDisplayMap: Record<string, string> = {
  'Tops': 'Shirts',
  'Bottoms': 'Pants',
  'Shoes': 'Shoes',
  'Accessories': 'Accessories'
};

const CategoryPage = () => {
  const { user } = useAuth();
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(searchParams.get('add') === 'true');
  
  // Get the category ID from the URL path
  const categoryId = category ? categoryMap[category] : null;
  const categoryDisplay = categoryId ? categoryDisplayMap[categoryId] : '';
  
  useEffect(() => {
    if (categoryDisplay) {
      document.title = `${categoryDisplay} | Wardrobify`;
    }
  }, [categoryDisplay]);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }
  
  // Redirect if invalid category
  if (!categoryId) {
    return <Navigate to="/wardrobe" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/wardrobe">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">My {categoryDisplay}</h1>
        </div>
        
        <Button onClick={() => setShowAddModal(true)} className="gap-1">
          <PlusCircle size={16} />
          Add {categoryDisplay}
        </Button>
      </div>
      
      <ClothingGrid 
        categoryFilter={categoryId} 
        showAddButton={true}
        selectedCategory={categoryId}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
      />
    </div>
  );
};

export default CategoryPage;
