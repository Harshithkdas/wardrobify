
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClothingItem from './ClothingItem';
import { Search, Filter, PlusCircle, Upload, X, Shirt, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { sampleMensClothingItems } from '@/utils/sampleClothingItems';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ClothingItemType {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  occasion?: string[];
}

interface ClothingGridProps {
  categoryFilter: string | null;
}

const ClothingGrid = ({ categoryFilter }: ClothingGridProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ClothingItemType[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tops');
  const [newItemColor, setNewItemColor] = useState('');
  const [newItemOccasion, setNewItemOccasion] = useState<string[]>(['Casual']);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingItems, setAddingItems] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    colors: [] as string[],
    occasions: [] as string[]
  });
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);

  const activeFilterCount = activeFilters.colors.length + activeFilters.occasions.length;
  
  useEffect(() => {
    const fetchClothingItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let query = supabase
          .from('clothing_items')
          .select('id, name, category, color, image, occasion')
          .eq('user_id', user.id);
        
        // Apply category filter if provided
        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        const formattedItems = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          color: item.color,
          imageUrl: item.image,
          occasion: item.occasion
        }));
        
        setItems(formattedItems);
        
        // Extract unique colors and occasions for filters
        const colors = [...new Set(formattedItems.map(item => item.color))].filter(Boolean);
        setAvailableColors(colors);
        
        const occasions = [...new Set(formattedItems.flatMap(item => item.occasion || []))].filter(Boolean);
        setAvailableOccasions(occasions);
      } catch (error: any) {
        console.error('Error fetching clothing items:', error);
        toast.error('Failed to load your wardrobe');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClothingItems();
  }, [user, categoryFilter]);
  
  const handleSelect = (id: string) => {
    toast.info(`Item ${id} selected`);
  };
  
  const handleEdit = (id: string) => {
    toast.info(`Editing item ${id}`);
  };
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success('Item removed from wardrobe');
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Failed to remove item');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large. Maximum size is 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to add items');
      return;
    }
    
    if (!newItemName) {
      toast.error('Please enter a name for the item');
      return;
    }
    
    if (!selectedImage && !newItemColor) {
      toast.error('Please select an image or enter a color');
      return;
    }
    
    try {
      const imageUrl = selectedImage || 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80';
      
      const { data, error } = await supabase
        .from('clothing_items')
        .insert({
          name: newItemName,
          category: newItemCategory,
          color: newItemColor || 'Unknown',
          image: imageUrl,
          material: 'Unknown',
          season: ['All'],
          occasion: newItemOccasion,
          user_id: user.id
        })
        .select('id, name, category, color, image, occasion');
      
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        const newItem = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          color: data[0].color,
          imageUrl: data[0].image,
          occasion: data[0].occasion
        };
        
        setItems(prevItems => [...prevItems, newItem]);
        toast.success('New clothing item added to wardrobe');
        
        // Update available colors and occasions
        if (newItem.color && !availableColors.includes(newItem.color)) {
          setAvailableColors(prev => [...prev, newItem.color]);
        }
        
        if (newItem.occasion) {
          const newOccasions = newItem.occasion.filter(o => !availableOccasions.includes(o));
          if (newOccasions.length > 0) {
            setAvailableOccasions(prev => [...prev, ...newOccasions]);
          }
        }
      }
      
      setNewItemName('');
      setNewItemCategory('Tops');
      setNewItemColor('');
      setNewItemOccasion(['Casual']);
      setSelectedImage(null);
      setShowAddModal(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item to wardrobe');
    }
  };
  
  const handleAddNew = () => {
    setShowAddModal(true);
  };
  
  const handleAddSampleItems = async () => {
    if (!user) {
      toast.error('You must be logged in to add items');
      return;
    }

    setAddingItems(true);
    try {
      let addedCount = 0;
      
      for (const item of sampleMensClothingItems) {
        const { data, error } = await supabase
          .from('clothing_items')
          .insert({
            name: item.name,
            category: item.category,
            color: item.color,
            image: item.image,
            material: item.material,
            season: item.season,
            occasion: item.occasion,
            user_id: user.id
          })
          .select('id, name, category, color, image');
        
        if (error) {
          console.error('Error adding sample item:', error);
          continue;
        }
        
        if (data && data[0]) {
          const newItem = {
            id: data[0].id,
            name: data[0].name,
            category: data[0].category,
            color: data[0].color,
            imageUrl: data[0].image
          };
          
          setItems(prevItems => [...prevItems, newItem]);
          addedCount++;
        }
      }
      
      toast.success(`Added ${addedCount} men's clothing items to your wardrobe`);
      
      // Update available filters
      const colors = [...new Set(sampleMensClothingItems.map(item => item.color))].filter(Boolean);
      setAvailableColors(prev => [...new Set([...prev, ...colors])]);
      
      const occasions = [...new Set(sampleMensClothingItems.flatMap(item => item.occasion || []))].filter(Boolean);
      setAvailableOccasions(prev => [...new Set([...prev, ...occasions])]);
      
    } catch (error: any) {
      console.error('Error adding sample items:', error);
      toast.error('Failed to add sample items to wardrobe');
    } finally {
      setAddingItems(false);
    }
  };
  
  const toggleColorFilter = (color: string) => {
    setActiveFilters(prev => {
      if (prev.colors.includes(color)) {
        return { ...prev, colors: prev.colors.filter(c => c !== color) };
      } else {
        return { ...prev, colors: [...prev.colors, color] };
      }
    });
  };
  
  const toggleOccasionFilter = (occasion: string) => {
    setActiveFilters(prev => {
      if (prev.occasions.includes(occasion)) {
        return { ...prev, occasions: prev.occasions.filter(o => o !== occasion) };
      } else {
        return { ...prev, occasions: [...prev.occasions, occasion] };
      }
    });
  };
  
  const clearFilters = () => {
    setActiveFilters({ colors: [], occasions: [] });
  };
  
  const filteredItems = items.filter(item => {
    // Apply search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply color filters
    const matchesColor = activeFilters.colors.length === 0 || 
      activeFilters.colors.includes(item.color);
    
    // Apply occasion filters
    const matchesOccasion = activeFilters.occasions.length === 0 || 
      (item.occasion && item.occasion.some(o => activeFilters.occasions.includes(o)));
    
    return matchesSearch && matchesColor && matchesOccasion;
  });
  
  const categoryOptions = [
    { value: 'Tops', label: 'Shirts' },
    { value: 'Bottoms', label: 'Pants' },
    { value: 'Shoes', label: 'Shoes' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Outerwear', label: 'Outerwear' }
  ];
  
  const occasionOptions = [
    'Casual', 'Formal', 'Business', 'Party', 'Sports', 'Beach', 'Winter', 'Summer'
  ];
  
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
          <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 relative">
                <Filter size={16} />
                Filter
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-600" variant="default">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-7 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                
                {availableColors.length > 0 && (
                  <div>
                    <Label className="block mb-2">Colors</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => toggleColorFilter(color)}
                          className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 ${
                            activeFilters.colors.includes(color)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                          {activeFilters.colors.includes(color) && (
                            <Check size={12} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {availableOccasions.length > 0 && (
                  <div>
                    <Label className="block mb-2">Occasions</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableOccasions.map(occasion => (
                        <button
                          key={occasion}
                          onClick={() => toggleOccasionFilter(occasion)}
                          className={`px-2 py-1 rounded-md text-xs ${
                            activeFilters.occasions.includes(occasion)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {occasion}
                          {activeFilters.occasions.includes(occasion) && (
                            <Check size={12} className="ml-1 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={handleAddNew} className="gap-1">
            <PlusCircle size={16} />
            Add Item
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddSampleItems} 
            disabled={addingItems}
            className="gap-1"
          >
            <Shirt size={16} />
            {addingItems ? 'Adding...' : 'Add Sample Items'}
          </Button>
        </div>
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.colors.map(color => (
            <Badge key={`color-${color}`} variant="secondary" className="gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.toLowerCase() }} />
              {color}
              <X size={14} className="ml-1 cursor-pointer" onClick={() => toggleColorFilter(color)} />
            </Badge>
          ))}
          {activeFilters.occasions.map(occasion => (
            <Badge key={`occasion-${occasion}`} variant="secondary" className="gap-1">
              {occasion}
              <X size={14} className="ml-1 cursor-pointer" onClick={() => toggleOccasionFilter(occasion)} />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs px-2">
            Clear all
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mt-1 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            {searchQuery || activeFilterCount > 0 ? 
              "We couldn't find any clothing items matching your filters." : 
              "Your wardrobe is empty. Start adding your clothes!"}
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
              occasion={item.occasion}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Item</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddItemSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedImage ? (
                      <div className="relative">
                        <img 
                          src={selectedImage} 
                          alt="Selected" 
                          className="mx-auto h-48 object-contain" 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    id="item-name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="White Cotton T-Shirt"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="item-category"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="item-color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <Input
                    id="item-color"
                    value={newItemColor}
                    onChange={(e) => setNewItemColor(e.target.value)}
                    placeholder="White"
                  />
                </div>
                
                <div>
                  <label htmlFor="item-occasion" className="block text-sm font-medium text-gray-700 mb-1">
                    Occasions
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {occasionOptions.map(occasion => (
                      <label key={occasion} className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={newItemOccasion.includes(occasion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewItemOccasion(prev => [...prev, occasion]);
                            } else {
                              setNewItemOccasion(prev => prev.filter(o => o !== occasion));
                            }
                          }}
                          className="rounded text-blue-500"
                        />
                        <span className="text-sm">{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add to Wardrobe
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClothingGrid;
