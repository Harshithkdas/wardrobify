
import { Image, CheckCircle, Shirt } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface WardrobeToolbarProps {
  clothingItems: Array<{ id: string; imageUrl: string }>;
  onAddItem: (imageUrl?: string) => void;
  savedOutfits: Array<{ id: string; name: string; items: any[] }>;
  onLoadOutfit: (outfit: { id: string; name: string; items: any[] }) => void;
}

export const WardrobeToolbar = ({ 
  clothingItems, 
  onAddItem, 
  savedOutfits, 
  onLoadOutfit 
}: WardrobeToolbarProps) => {
  const [showOutfits, setShowOutfits] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Add from Your Wardrobe</h3>
        <button 
          onClick={() => setShowOutfits(!showOutfits)}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showOutfits ? 'Show Clothing Items' : 'Show Saved Outfits'}
        </button>
      </div>

      {showOutfits ? (
        // Saved Outfits Section
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {savedOutfits.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No saved outfits yet. Create and save an outfit to see it here.
            </div>
          ) : (
            savedOutfits.map((outfit) => (
              <button 
                key={outfit.id}
                onClick={() => onLoadOutfit(outfit)}
                className="flex-shrink-0 flex flex-col items-center w-16 text-center"
              >
                <div className="w-16 h-16 border border-gray-200 rounded-md hover:border-gray-300 flex items-center justify-center bg-gray-50">
                  <Shirt size={20} className="text-gray-500" />
                </div>
                <span className="text-xs truncate w-full mt-1">{outfit.name}</span>
              </button>
            ))
          )}
        </div>
      ) : (
        // Clothing Items Section
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button 
            onClick={() => onAddItem()}
            className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md hover:border-gray-300 flex items-center justify-center"
          >
            <Image size={20} className="text-gray-500" />
          </button>
          
          {clothingItems.length === 0 ? (
            <div className="text-sm text-gray-500 py-2">
              No items in your wardrobe yet. Add items in the Wardrobe page.
            </div>
          ) : (
            clothingItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onAddItem(item.imageUrl)}
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
            ))
          )}
        </div>
      )}
    </div>
  );
};
