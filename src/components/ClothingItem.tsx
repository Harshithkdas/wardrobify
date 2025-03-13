
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Info, Tag } from 'lucide-react';

interface ClothingItemProps {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  occasion?: string[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClothingItem = ({
  id,
  name,
  category,
  color,
  imageUrl,
  occasion = [],
  onSelect,
  onEdit,
  onDelete
}: ClothingItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSelect = () => {
    onSelect(id);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {/* Info badge */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-medium text-gray-800">
        {category}
      </div>
      
      {/* Item details */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-gray-500">{color}</span>
        </div>
        
        {/* Occasion tags */}
        {occasion && occasion.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {occasion.slice(0, 2).map(occ => (
              <span 
                key={occ}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                <Tag size={10} className="mr-1" />
                {occ}
              </span>
            ))}
            {occasion.length > 2 && (
              <span className="text-xs text-gray-500">+{occasion.length - 2} more</span>
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons (visible on hover) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center gap-2 p-4"
      >
        <button 
          onClick={handleEdit}
          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Show detailed info
          }}
          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        >
          <Info size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ClothingItem;
