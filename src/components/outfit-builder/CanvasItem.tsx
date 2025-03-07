
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export interface CanvasItemProps {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
  isActive: boolean;
  onDragStart: (id: string) => void;
  onDrag: (id: string, e: any, info: { offset: { x: number, y: number } }) => void;
  onDragEnd: () => void;
  onRotate: (id: string, direction: 'clockwise' | 'counterclockwise') => void;
  onRemove: (id: string) => void;
}

export const CanvasItem = ({
  id,
  imageUrl,
  x,
  y,
  width,
  height,
  zIndex,
  rotation,
  isActive,
  onDragStart,
  onDrag,
  onDragEnd,
  onRotate,
  onRemove
}: CanvasItemProps) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => onDragStart(id)}
      onDrag={(e, info) => onDrag(id, e, info)}
      onDragEnd={onDragEnd}
      initial={{ x, y, rotate: rotation }}
      animate={{ 
        x, 
        y, 
        rotate: rotation,
        scale: isActive ? 1.05 : 1
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ 
        position: 'absolute',
        width,
        height,
        zIndex,
      }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500' : ''}`}
    >
      <img 
        src={imageUrl} 
        alt="Clothing item" 
        className="w-full h-full object-contain pointer-events-none"
      />
      
      {isActive && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-md flex items-center p-1">
          <button 
            onClick={() => onRotate(id, 'counterclockwise')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ↺
          </button>
          <button 
            onClick={() => onRemove(id)}
            className="p-1 hover:bg-gray-100 rounded text-red-500"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => onRotate(id, 'clockwise')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ↻
          </button>
        </div>
      )}
    </motion.div>
  );
};
