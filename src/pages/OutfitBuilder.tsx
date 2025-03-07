
import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OutfitCanvas from '@/components/OutfitCanvas';
import { useAuth } from '@/hooks/useAuth';

const OutfitBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Outfit Builder | Wardrobify';
  }, []);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="gap-1"
        >
          <ChevronLeft size={16} />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold">Outfit Builder</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <OutfitCanvas />
      </div>
    </div>
  );
};

export default OutfitBuilder;
