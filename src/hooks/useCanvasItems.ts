
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface CanvasItem {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
}

export const useCanvasItems = (canvasWidth: number = 500, canvasHeight: number = 400) => {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  const handleDragStart = useCallback((id: string) => {
    setActiveItemId(id);
    // Bring the item to the front by updating its z-index
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, zIndex: Math.max(...prevItems.map(i => i.zIndex)) + 1 } 
          : item
      )
    );
  }, []);
  
  const handleDrag = useCallback((id: string, e: any, info: { offset: { x: number, y: number } }) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y } 
          : item
      )
    );
  }, []);
  
  const handleDragEnd = useCallback(() => {
    setActiveItemId(null);
  }, []);
  
  const handleRotate = useCallback((id: string, direction: 'clockwise' | 'counterclockwise') => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              rotation: item.rotation + (direction === 'clockwise' ? 15 : -15) 
            } 
          : item
      )
    );
  }, []);
  
  const handleRemoveItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removed from outfit');
  }, []);
  
  const handleAddItem = useCallback((imageUrl: string = '') => {
    // If no image URL is provided, use a default one
    const itemImageUrl = imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
    
    // Position new items in a row-based layout
    let posX, posY;
    
    // Default height for positioning
    const itemHeight = 150;
    const itemWidth = 150;
    const itemGap = 20;
    const itemsPerRow = 3;
    
    // Calculate the row and column
    const itemsCount = items.length;
    const row = Math.floor(itemsCount / itemsPerRow);
    const col = itemsCount % itemsPerRow;
    
    // Calculate position
    posX = col * (itemWidth + itemGap) + 50; // Start from left with padding
    posY = row * (itemHeight + itemGap) + 50; // Top padding
    
    // Make sure items stay within canvas
    posX = Math.min(Math.max(posX, 20), canvasWidth - itemWidth - 20);
    posY = Math.min(Math.max(posY, 20), canvasHeight - itemHeight - 20);
    
    const newItem: CanvasItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      imageUrl: itemImageUrl,
      x: posX,
      y: posY,
      width: itemWidth,
      height: itemHeight,
      zIndex: items.length,
      rotation: 0
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    toast.success('Item added to outfit');
  }, [items.length, canvasWidth, canvasHeight]);
  
  const clearItems = useCallback(() => {
    setItems([]);
    toast.info('Canvas cleared');
  }, []);
  
  return {
    items,
    setItems,
    activeItemId,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleRotate,
    handleRemoveItem,
    handleAddItem,
    clearItems
  };
};
