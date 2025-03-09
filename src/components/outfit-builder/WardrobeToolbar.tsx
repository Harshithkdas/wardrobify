
import { Image, CheckCircle } from 'lucide-react';

interface WardrobeToolbarProps {
  clothingItems: Array<{ id: string; imageUrl: string }>;
  onAddItem: (imageUrl?: string) => void;
}

export const WardrobeToolbar = ({ clothingItems, onAddItem }: WardrobeToolbarProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Add from Your Wardrobe</h3>
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
    </div>
  );
};
