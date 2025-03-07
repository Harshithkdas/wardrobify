
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ClothingGrid from '@/components/ClothingGrid';
import { useAuth } from '@/hooks/useAuth';

const Wardrobe = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = 'My Wardrobe | Wardrobify';
  }, []);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wardrobe</h1>
      <ClothingGrid />
    </div>
  );
};

export default Wardrobe;
