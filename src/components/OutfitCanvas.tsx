
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Download, Info, Image, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface CanvasItem {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
}

const OutfitCanvas = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
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
  
  const handleDragStart = (id: string) => {
    setActiveItemId(id);
    // Bring the item to the front by updating its z-index
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, zIndex: Math.max(...prevItems.map(i => i.zIndex)) + 1 } 
          : item
      )
    );
  };
  
  const handleDrag = (id: string, e: any, info: { offset: { x: number, y: number } }) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y } 
          : item
      )
    );
  };
  
  const handleDragEnd = () => {
    setActiveItemId(null);
  };
  
  const handleRotate = (id: string, direction: 'clockwise' | 'counterclockwise') => {
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
  };
  
  const handleRemoveItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removed from outfit');
  };
  
  const handleAddItem = (imageUrl: string = '') => {
    // If no image URL is provided, use a default one
    const itemImageUrl = imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
    
    // Calculate a random position within the canvas boundaries
    const canvasWidth = canvasRef.current?.clientWidth || 500;
    const canvasHeight = canvasRef.current?.clientHeight || 400;
    
    const randomX = Math.random() * (canvasWidth - 200) + 50;
    const randomY = Math.random() * (canvasHeight - 200) + 50;
    
    const newItem: CanvasItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      imageUrl: itemImageUrl,
      x: randomX,
      y: randomY,
      width: 150,
      height: 150,
      zIndex: items.length,
      rotation: 0
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    toast.success('Item added to outfit');
  };
  
  const handleSampleItemClick = (imageUrl: string) => {
    handleAddItem(imageUrl);
  };
  
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
  
  const handleClearCanvas = () => {
    setItems([]);
    toast.info('Canvas cleared');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="text"
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            className="text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          />
          <p className="text-sm text-gray-500">Drag and arrange items to create your outfit</p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleClearCanvas} className="gap-1">
            <Trash2 size={16} />
            Clear
          </Button>
          <Button size="sm" onClick={handleSaveOutfit} className="gap-1">
            <Save size={16} />
            Save
          </Button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="flex-1 relative border border-dashed border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Image size={24} className="text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Your canvas is empty</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-4">
              Add clothing items from your wardrobe to start creating an outfit
            </p>
            <Button onClick={() => handleAddItem()} size="sm">
              Add Sample Item
            </Button>
          </div>
        ) : (
          // Canvas with items
          items.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              onDragStart={() => handleDragStart(item.id)}
              onDrag={(e, info) => handleDrag(item.id, e, info)}
              onDragEnd={handleDragEnd}
              initial={{ x: item.x, y: item.y, rotate: item.rotation }}
              animate={{ 
                x: item.x, 
                y: item.y, 
                rotate: item.rotation,
                scale: activeItemId === item.id ? 1.05 : 1
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ 
                position: 'absolute',
                width: item.width,
                height: item.height,
                zIndex: item.zIndex,
              }}
              className={`cursor-move ${activeItemId === item.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <img 
                src={item.imageUrl} 
                alt="Clothing item" 
                className="w-full h-full object-contain pointer-events-none"
              />
              
              {/* Controls that appear when item is active */}
              {activeItemId === item.id && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-md flex items-center p-1">
                  <button 
                    onClick={() => handleRotate(item.id, 'counterclockwise')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ↺
                  </button>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleRotate(item.id, 'clockwise')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    ↻
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
      
      {/* Item toolbar */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Add to Canvas</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button 
            onClick={() => handleAddItem()}
            className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md hover:border-gray-300 flex items-center justify-center"
          >
            <Image size={20} className="text-gray-500" />
          </button>
          
          {/* Sample wardrobe items */}
          {clothingItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleSampleItemClick(item.imageUrl)}
              className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden group relative"
            >
              <img 
                src={item.imageUrl} 
                alt="Clothing item" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <CheckCircle size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitCanvas;
