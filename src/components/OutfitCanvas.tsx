
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
  
  // Sample clothing items - in a real app, these would come from the user's wardrobe
  const clothingItems = [
    { id: 'sample-1', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300&auto=format' },
    { id: 'sample-2', imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=300&auto=format' },
    { id: 'sample-3', imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=300&auto=format' },
    { id: 'sample-4', imageUrl: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?q=80&w=300&auto=format' },
    { id: 'sample-5', imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=300&auto=format' },
  ];

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
      
      <WardrobeToolbar
        clothingItems={clothingItems}
        onAddItem={(imageUrl) => handleAddItem(imageUrl)}
      />
    </div>
  );
};

export default OutfitCanvas;
