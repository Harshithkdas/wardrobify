
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCanvasStateProps {
  onAddItem: () => void;
}

export const EmptyCanvasState = ({ onAddItem }: EmptyCanvasStateProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Image size={24} className="text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-900 mb-1">Your canvas is empty</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-4">
        Add clothing items from your wardrobe to start creating an outfit
      </p>
      <Button onClick={onAddItem} size="sm">
        Add Sample Item
      </Button>
    </div>
  );
};
