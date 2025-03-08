
import { useState } from 'react';
import { motion } from 'framer-motion';
import ClothingItem from './ClothingItem';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Sample data
const dummyClothingItems = [
  {
    id: '1',
    name: 'White Cotton T-Shirt',
    category: 'Tops',
    color: 'White',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
  },
  {
    id: '2',
    name: 'Blue Jeans',
    category: 'Bottoms',
    color: 'Blue',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80'
  },
  {
    id: '3',
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    color: 'Black',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80'
  },
  {
    id: '4',
    name: 'Navy Blue Dress Shirt',
    category: 'Tops',
    color: 'Navy',
    imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
  },
  {
    id: '5',
    name: 'Khaki Chinos',
    category: 'Bottoms',
    color: 'Khaki',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1497&q=80'
  },
  {
    id: '6',
    name: 'Red Sweater',
    category: 'Tops',
    color: 'Red',
    imageUrl: 'https://images.unsplash.com/photo-1580331451432-64ab679aa9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  },
];

const ClothingGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(dummyClothingItems);
  
  const handleSelect = (id: string) => {
    toast.info(`Item ${id} selected`);
    // Handle selection logic
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Editing item ${id}`);
    // Handle edit logic
  };
  
  const handleDelete = (id: string) => {
    toast.success(`Item ${id} removed from wardrobe`);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleAddNew = () => {
    // Create a new mock clothing item
    const newItem = {
      id: `item-${Date.now()}`,
      name: 'New Clothing Item',
      category: 'Tops',
      color: 'Blue',
      imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'
    };
    
    // Add the new item to the state
    setItems(prevItems => [...prevItems, newItem]);
    toast.success('New clothing item added');
  };
  
  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.color.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search your wardrobe"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={16} />
            Filter
          </Button>
          <Button size="sm" onClick={handleAddNew} className="gap-1">
            <PlusCircle size={16} />
            Add Item
          </Button>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            We couldn't find any clothing items matching your search.
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredItems.map((item) => (
            <ClothingItem
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category}
              color={item.color}
              imageUrl={item.imageUrl}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ClothingGrid;
