
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasHeaderProps {
  canvasName: string;
  onCanvasNameChange: (name: string) => void;
  onClearCanvas: () => void;
  onSaveOutfit: () => void;
}

export const CanvasHeader = ({ 
  canvasName, 
  onCanvasNameChange, 
  onClearCanvas, 
  onSaveOutfit 
}: CanvasHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <input
          type="text"
          value={canvasName}
          onChange={(e) => onCanvasNameChange(e.target.value)}
          className="text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
        />
        <p className="text-sm text-gray-500">Drag and arrange items to create your outfit</p>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onClearCanvas} className="gap-1">
          <Trash2 size={16} />
          Clear
        </Button>
        <Button size="sm" onClick={onSaveOutfit} className="gap-1">
          <Save size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};
