
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { useCanvasItems, CanvasItem } from '@/hooks/useCanvasItems';
import { CanvasHeader } from './outfit-builder/CanvasHeader';
import { EmptyCanvasState } from './outfit-builder/EmptyCanvasState';
import { CanvasItem as CanvasItemComponent } from './outfit-builder/CanvasItem';
import { WardrobeToolbar } from './outfit-builder/WardrobeToolbar';
import { Json } from '@/integrations/supabase/types';

interface SavedOutfit {
  id: string;
  name: string;
  items: CanvasItem[];
}

const OutfitCanvas = () => {
  const { user } = useAuth();
  const [canvasName, setCanvasName] = useState('Untitled Outfit');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [userClothingItems, setUserClothingItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
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
  
  // Fetch saved outfits from Supabase
  useEffect(() => {
    const fetchSavedOutfits = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('outfits')
          .select('id, name, items')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform the data to ensure items is properly typed
        const typedOutfits: SavedOutfit[] = data.map(outfit => ({
          id: outfit.id,
          name: outfit.name,
          items: outfit.items as unknown as CanvasItem[]
        }));
        
        setSavedOutfits(typedOutfits);
      } catch (error) {
        console.error('Error fetching saved outfits:', error);
        toast.error('Failed to load your saved outfits');
      }
    };
    
    fetchSavedOutfits();
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
    clearItems,
    setItems
  } = useCanvasItems(canvasDimensions.width, canvasDimensions.height);
  
  const handleSaveOutfit = async () => {
    if (!user) {
      toast.error('You must be logged in to save outfits');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Cannot save an empty outfit');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          name: canvasName,
          items: items as unknown as Json
        })
        .select('id, name, items');
      
      if (error) {
        throw error;
      }
      
      // Add the new outfit to the saved outfits list with proper typing
      if (data && data.length > 0) {
        const newOutfit: SavedOutfit = {
          id: data[0].id,
          name: data[0].name,
          items: data[0].items as unknown as CanvasItem[]
        };
        
        setSavedOutfits(prev => [newOutfit, ...prev]);
      }
      
      toast.success('Outfit saved successfully!');
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast.error('Failed to save outfit');
    }
  };
  
  const handleLoadOutfit = (outfit: SavedOutfit) => {
    clearItems();
    setCanvasName(outfit.name);
    // Need to slightly delay setting items to ensure clearItems has completed
    setTimeout(() => {
      setItems(outfit.items);
      toast.success(`Loaded outfit: ${outfit.name}`);
    }, 50);
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
            <CanvasItemComponent
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
          savedOutfits={savedOutfits}
          onLoadOutfit={handleLoadOutfit}
        />
      )}
    </div>
  );
};

export default OutfitCanvas;
