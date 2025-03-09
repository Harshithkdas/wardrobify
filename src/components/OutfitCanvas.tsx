
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { useCanvasItems } from '@/hooks/useCanvasItems';
import { CanvasHeader } from './outfit-builder/CanvasHeader';
import { EmptyCanvasState } from './outfit-builder/EmptyCanvasState';
import { CanvasItem } from './outfit-builder/CanvasItem';
import { WardrobeToolbar } from './outfit-builder/WardrobeToolbar';

const OutfitCanvas = () => {
  const { user } = useAuth();
  const [canvasName, setCanvasName] = useState('Untitled Outfit');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [userClothingItems, setUserClothingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 400 });
  
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasDimensions({
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight
      });
    }
  }, []);
  
  // Fetch user's clothing items from Supabase
  useEffect(() => {
    const fetchUserWardrobe = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('id, image')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        const formattedItems = data.map(item => ({
          id: item.id,
          imageUrl: item.image
        }));
        
        setUserClothingItems(formattedItems);
      } catch (error) {
        console.error('Error fetching wardrobe items:', error);
        toast.error('Failed to load your wardrobe items');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserWardrobe();
  }, [user]);
  
  // Use our custom hook for managing canvas items
  const { 
    items, 
    activeItemId, 
    handleDragStart, 
    handleDrag, 
    handleDragEnd, 
    handleRotate, 
    handleRemoveItem, 
    handleAddItem, 
    clearItems 
  } = useCanvasItems(canvasDimensions.width, canvasDimensions.height);
  
  const handleSaveOutfit = async () => {
    if (!user) {
      toast.error('You must be logged in to save outfits');
      return;
    }
    
    // In a real app, you would save this to the database
    console.log('Saving outfit:', {
      name: canvasName,
      items: items,
      userId: user.id
    });
    
    toast.success('Outfit saved successfully!');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <CanvasHeader
        canvasName={canvasName}
        onCanvasNameChange={setCanvasName}
        onClearCanvas={clearItems}
        onSaveOutfit={handleSaveOutfit}
      />
      
      <div 
        ref={canvasRef}
        className="flex-1 relative border border-dashed border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {items.length === 0 ? (
          <EmptyCanvasState onAddItem={() => handleAddItem()} />
        ) : (
          // Canvas with items
          items.map((item) => (
            <CanvasItem
              key={item.id}
              {...item}
              isActive={activeItemId === item.id}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onRotate={handleRotate}
              onRemove={handleRemoveItem}
            />
          ))
        )}
      </div>
      
      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <WardrobeToolbar
          clothingItems={userClothingItems}
          onAddItem={(imageUrl) => handleAddItem(imageUrl)}
        />
      )}
    </div>
  );
};

export default OutfitCanvas;
