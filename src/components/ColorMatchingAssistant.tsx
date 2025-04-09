import { useState, useEffect } from 'react';
import { Palette, RefreshCw, Info, Check, ArrowRight, Shirt, Search, Target, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorScheme {
  name: string;
  colors: string[];
  description: string;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
}

interface ColorMatchingAssistantProps {
  userWardrobe?: ClothingItem[];
}

const COLOR_PALETTES = {
  "Red": {
    complementary: { name: "Complementary", colors: ["#FF0000", "#00FFFF"], description: "Colors opposite each other on the color wheel" },
    analogous: { name: "Analogous", colors: ["#FF0000", "#FF8000", "#FFFF00"], description: "Colors adjacent to each other on the color wheel" },
    triadic: { name: "Triadic", colors: ["#FF0000", "#00FF00", "#0000FF"], description: "Three colors evenly spaced on the color wheel" },
    monochromatic: { name: "Monochromatic", colors: ["#FF0000", "#CC0000", "#990000", "#660000"], description: "Different shades of a single color" },
    neutral: { name: "Neutral Pairing", colors: ["#FF0000", "#F5F5F5", "#E0E0E0", "#333333"], description: "Base color with neutral tones" },
  },
  "Blue": {
    complementary: { name: "Complementary", colors: ["#0000FF", "#FFAA00"], description: "Colors opposite each other on the color wheel" },
    analogous: { name: "Analogous", colors: ["#0000FF", "#0080FF", "#00FFFF"], description: "Colors adjacent to each other on the color wheel" },
    triadic: { name: "Triadic", colors: ["#0000FF", "#FF0000", "#00FF00"], description: "Three colors evenly spaced on the color wheel" },
    monochromatic: { name: "Monochromatic", colors: ["#0000FF", "#0000CC", "#000099", "#000066"], description: "Different shades of a single color" },
    neutral: { name: "Neutral Pairing", colors: ["#0000FF", "#F5F5F5", "#E0E0E0", "#333333"], description: "Base color with neutral tones" },
  },
  "Green": { 
    complementary: { name: "Complementary", colors: ["#00FF00", "#FF00FF"], description: "Colors opposite each other on the color wheel" },
    analogous: { name: "Analogous", colors: ["#00FF00", "#FFFF00", "#00FFFF"], description: "Colors adjacent to each other on the color wheel" },
    triadic: { name: "Triadic", colors: ["#00FF00", "#0000FF", "#FF0000"], description: "Three colors evenly spaced on the color wheel" },
    monochromatic: { name: "Monochromatic", colors: ["#00FF00", "#00CC00", "#009900", "#006600"], description: "Different shades of a single color" },
    neutral: { name: "Neutral Pairing", colors: ["#00FF00", "#F5F5F5", "#E0E0E0", "#333333"], description: "Base color with neutral tones" },
  },
  "Yellow": {
    complementary: { name: "Complementary", colors: ["#FFFF00", "#8000FF"], description: "Colors opposite each other on the color wheel" },
    analogous: { name: "Analogous", colors: ["#FFFF00", "#FF8000", "#80FF00"], description: "Colors adjacent to each other on the color wheel" },
    triadic: { name: "Triadic", colors: ["#FFFF00", "#FF00FF", "#00FFFF"], description: "Three colors evenly spaced on the color wheel" },
    monochromatic: { name: "Monochromatic", colors: ["#FFFF00", "#CCCC00", "#999900", "#666600"], description: "Different shades of a single color" },
    neutral: { name: "Neutral Pairing", colors: ["#FFFF00", "#F5F5F5", "#E0E0E0", "#333333"], description: "Base color with neutral tones" },
  },
  "Purple": {
    complementary: { name: "Complementary", colors: ["#8B5CF6", "#5CF68B"], description: "Colors opposite each other on the color wheel" },
    analogous: { name: "Analogous", colors: ["#8B5CF6", "#C75CF6", "#5C7AF6"], description: "Colors adjacent to each other on the color wheel" },
    triadic: { name: "Triadic", colors: ["#8B5CF6", "#F65C8B", "#5CF65C"], description: "Three colors evenly spaced on the color wheel" },
    monochromatic: { name: "Monochromatic", colors: ["#8B5CF6", "#7A4BE5", "#6A3AD4", "#5A29C3"], description: "Different shades of a single color" },
    neutral: { name: "Neutral Pairing", colors: ["#8B5CF6", "#F5F5F5", "#E0E0E0", "#333333"], description: "Base color with neutral tones" },
  },
  "Black": {
    complementary: { name: "Complementary", colors: ["#000000", "#FFFFFF"], description: "Black and white contrast" },
    analogous: { name: "Analogous", colors: ["#000000", "#222222", "#444444"], description: "Black with dark grays" },
    monochromatic: { name: "Monochromatic", colors: ["#000000", "#333333", "#666666", "#999999"], description: "Black with various grays" },
    neutral: { name: "Neutral Pairing", colors: ["#000000", "#FFFFFF", "#F0F0F0", "#E0E0E0"], description: "Black with white and light grays" },
    accent: { name: "Accent Colors", colors: ["#000000", "#FF0000", "#0000FF", "#FFFF00"], description: "Black with vibrant accent colors" },
  },
  "White": {
    complementary: { name: "Complementary", colors: ["#FFFFFF", "#000000"], description: "White and black contrast" },
    analogous: { name: "Analogous", colors: ["#FFFFFF", "#F0F0F0", "#E0E0E0"], description: "White with light grays" },
    monochromatic: { name: "Monochromatic", colors: ["#FFFFFF", "#EEEEEE", "#DDDDDD", "#CCCCCC"], description: "White with various light grays" },
    neutral: { name: "Neutral Pairing", colors: ["#FFFFFF", "#000000", "#333333", "#666666"], description: "White with black and dark grays" },
    accent: { name: "Accent Colors", colors: ["#FFFFFF", "#FF0000", "#0000FF", "#FFFF00"], description: "White with vibrant accent colors" },
  },
  "Gray": {
    complementary: { name: "Complementary", colors: ["#808080", "#7F7F7F"], description: "Medium gray with slightly contrasting gray" },
    analogous: { name: "Analogous", colors: ["#808080", "#7F8090", "#807F70"], description: "Gray with slight color variations" },
    monochromatic: { name: "Monochromatic", colors: ["#808080", "#A0A0A0", "#606060", "#404040"], description: "Different shades of gray" },
    neutral: { name: "Neutral Pairing", colors: ["#808080", "#FFFFFF", "#000000", "#D0D0D0"], description: "Gray with black, white and light gray" },
    accent: { name: "Accent Colors", colors: ["#808080", "#FF0000", "#0000FF", "#FFFF00"], description: "Gray with vibrant accent colors" },
  },
  "Brown": {
    complementary: { name: "Complementary", colors: ["#964B00", "#004B96"], description: "Brown with blue (complementary)" },
    analogous: { name: "Analogous", colors: ["#964B00", "#964B0", "#96004B"], description: "Brown with similar earthy tones" },
    triadic: { name: "Triadic", colors: ["#964B00", "#00964B", "#4B0096"], description: "Brown with green and purple" },
    monochromatic: { name: "Monochromatic", colors: ["#964B00", "#6E3500", "#452100", "#2D1600"], description: "Different shades of brown" },
    neutral: { name: "Neutral Pairing", colors: ["#964B00", "#F5F5F5", "#E0E0E0", "#333333"], description: "Brown with neutral tones" },
  },
  "Navy": {
    complementary: { name: "Complementary", colors: ["#000080", "#808000"], description: "Navy with olive (complementary)" },
    analogous: { name: "Analogous", colors: ["#000080", "#000050", "#500080"], description: "Navy with similar deep tones" },
    triadic: { name: "Triadic", colors: ["#000080", "#800000", "#008000"], description: "Navy with maroon and green" },
    monochromatic: { name: "Monochromatic", colors: ["#000080", "#000060", "#000040", "#000020"], description: "Different shades of navy" },
    neutral: { name: "Neutral Pairing", colors: ["#000080", "#F5F5F5", "#E0E0E0", "#333333"], description: "Navy with neutral tones" },
  },
  "Beige": {
    complementary: { name: "Complementary", colors: ["#F5F5DC", "#DCF5F5"], description: "Beige with light cyan" },
    analogous: { name: "Analogous", colors: ["#F5F5DC", "#F5DCF5", "#DCF5DC"], description: "Beige with similar light tones" },
    triadic: { name: "Triadic", colors: ["#F5F5DC", "#DCF5F5", "#F5DCF5"], description: "Beige with light cyan and light magenta" },
    monochromatic: { name: "Monochromatic", colors: ["#F5F5DC", "#E6E6CE", "#D7D7BF", "#C8C8B1"], description: "Different shades of beige" },
    neutral: { name: "Neutral Pairing", colors: ["#F5F5DC", "#333333", "#666666", "#999999"], description: "Beige with darker neutral tones" },
  }
};

const colorOptions = Object.keys(COLOR_PALETTES);

type SchemeType = 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'neutral' | 'accent';

const schemeTypeOptions: {value: SchemeType, label: string}[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'neutral', label: 'Neutral' }
];

// Clothing suggestions for different color schemes
const CLOTHING_SUGGESTIONS = {
  complementary: "Complementary colors create a bold, vibrant look. Try pairing a main color with its complement as an accent.",
  analogous: "Analogous colors create a harmonious, cohesive look. Great for casual outfits with a coordinated feel.",
  triadic: "Triadic colors offer vibrant contrast while maintaining balance. Best used with one dominant color and the others as accents.",
  monochromatic: "Monochromatic schemes create a sleek, sophisticated look. Perfect for formal occasions or minimalist styles.",
  neutral: "Neutral pairings work well for versatile, everyday outfits. The base color provides interest while neutrals balance the look."
};

// Helper function to determine if a color is close to another color
const isColorSimilar = (color1: string, color2: string): boolean => {
  // Simple color matching based on color name
  // In a real app, you'd use RGB comparison
  if (!color1 || !color2) return false;
  
  const color1Lower = color1.toLowerCase();
  const color2Lower = color2.toLowerCase();
  
  // Check if the color names are similar
  if (color1Lower === color2Lower) return true;
  
  // Check for color families
  const colorFamilies = {
    red: ['red', 'crimson', 'maroon', 'burgundy', 'ruby'],
    blue: ['blue', 'navy', 'azure', 'cobalt', 'sky', 'teal', 'turquoise'],
    green: ['green', 'olive', 'emerald', 'lime', 'mint', 'sage'],
    yellow: ['yellow', 'gold', 'amber', 'mustard'],
    orange: ['orange', 'peach', 'coral', 'salmon'],
    purple: ['purple', 'violet', 'lavender', 'plum', 'magenta', 'mauve'],
    pink: ['pink', 'rose', 'fuchsia'],
    brown: ['brown', 'tan', 'beige', 'khaki', 'camel'],
    gray: ['gray', 'grey', 'silver', 'charcoal'],
    black: ['black'],
    white: ['white', 'ivory', 'cream']
  };
  
  // Check if both colors belong to the same family
  for (const [family, variations] of Object.entries(colorFamilies)) {
    if (variations.some(v => color1Lower.includes(v)) && 
        variations.some(v => color2Lower.includes(v))) {
      return true;
    }
  }
  
  return false;
};

// Helper function to find matching items from wardrobe
const findMatchingItems = (
  baseColor: string, 
  schemeType: SchemeType, 
  wardrobe: ClothingItem[]
): ClothingItem[][] => {
  if (!wardrobe || wardrobe.length === 0) return [];
  
  const scheme = COLOR_PALETTES[baseColor]?.[schemeType];
  if (!scheme) return [];
  
  // Get the colors from the scheme
  const schemeColors = scheme.colors;
  
  // Group wardrobe items by category
  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'];
  const itemsByCategory: Record<string, ClothingItem[]> = {};
  
  categories.forEach(category => {
    itemsByCategory[category] = wardrobe.filter(item => item.category === category);
  });
  
  // Find matching items for each color in the scheme
  const matchingSets: ClothingItem[][] = [];
  
  // Find one combination
  const matchingSet: ClothingItem[] = [];
  
  // First, find a base item that matches the baseColor
  const possibleBaseItems = wardrobe.filter(item => 
    isColorSimilar(item.color, baseColor) && 
    (item.category === 'Tops' || item.category === 'Bottoms')
  );
  
  if (possibleBaseItems.length > 0) {
    // Add a base item
    const baseItem = possibleBaseItems[Math.floor(Math.random() * possibleBaseItems.length)];
    matchingSet.push(baseItem);
    
    // Find complementary items for each category we don't have yet
    const usedCategories = new Set([baseItem.category]);
    
    // Try to find items for other categories that match our color scheme
    for (const category of categories) {
      if (!usedCategories.has(category) && itemsByCategory[category]?.length > 0) {
        // Skip if we already have an item from this category
        if (matchingSet.some(item => item.category === category)) continue;
        
        // For complementary items, prioritize items with colors from our scheme
        let potentialItems = itemsByCategory[category].filter(item => 
          schemeColors.some((schemeColor, index) => 
            index > 0 && isColorSimilar(item.color, schemeColor)
          )
        );
        
        // If no matching items found, try neutral colors
        if (potentialItems.length === 0) {
          potentialItems = itemsByCategory[category].filter(item => 
            isColorSimilar(item.color, 'Black') || 
            isColorSimilar(item.color, 'White') || 
            isColorSimilar(item.color, 'Gray')
          );
        }
        
        // If still no matches, just use any item from this category
        if (potentialItems.length === 0) {
          potentialItems = itemsByCategory[category];
        }
        
        if (potentialItems.length > 0) {
          const selectedItem = potentialItems[Math.floor(Math.random() * potentialItems.length)];
          matchingSet.push(selectedItem);
          usedCategories.add(category);
        }
      }
    }
    
    if (matchingSet.length > 1) {
      matchingSets.push(matchingSet);
    }
  }
  
  // Try to create more combinations if needed
  if (matchingSets.length === 0 && wardrobe.length > 0) {
    // If no good matches found, create a basic outfit
    const tops = itemsByCategory['Tops'] || [];
    const bottoms = itemsByCategory['Bottoms'] || [];
    
    if (tops.length > 0 && bottoms.length > 0) {
      const randomTop = tops[Math.floor(Math.random() * tops.length)];
      const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
      
      matchingSets.push([randomTop, randomBottom]);
    }
  }
  
  return matchingSets;
};

const ColorMatchingAssistant = ({ userWardrobe = [] }: ColorMatchingAssistantProps) => {
  const [baseColor, setBaseColor] = useState<string>("Blue");
  const [schemeType, setSchemeType] = useState<SchemeType>("complementary");
  const [currentScheme, setCurrentScheme] = useState<ColorScheme | null>(null);
  const [activeTab, setActiveTab] = useState("theory");
  const [matchingOutfits, setMatchingOutfits] = useState<ClothingItem[][]>([]);
  
  // Set initial color scheme
  useEffect(() => {
    if (COLOR_PALETTES[baseColor] && COLOR_PALETTES[baseColor][schemeType]) {
      setCurrentScheme(COLOR_PALETTES[baseColor][schemeType]);
    }
  }, []);
  
  const generateColorScheme = () => {
    if (COLOR_PALETTES[baseColor] && COLOR_PALETTES[baseColor][schemeType]) {
      setCurrentScheme(COLOR_PALETTES[baseColor][schemeType]);
      
      // Find matching wardrobe items if we're on the wardrobe tab
      if (activeTab === "wardrobe" && userWardrobe.length > 0) {
        const matches = findMatchingItems(baseColor, schemeType, userWardrobe);
        setMatchingOutfits(matches);
      }
    }
  };

  const handleBaseColorChange = (value: string) => {
    setBaseColor(value);
    // Find available scheme for this color
    const availableSchemes = Object.keys(COLOR_PALETTES[value]);
    if (!availableSchemes.includes(schemeType)) {
      setSchemeType(availableSchemes[0] as SchemeType);
    }
    
    if (COLOR_PALETTES[value][schemeType]) {
      setCurrentScheme(COLOR_PALETTES[value][schemeType]);
      
      // Update matching outfits when color changes
      if (activeTab === "wardrobe" && userWardrobe.length > 0) {
        const matches = findMatchingItems(value, schemeType as SchemeType, userWardrobe);
        setMatchingOutfits(matches);
      }
    } else if (availableSchemes.length > 0) {
      setSchemeType(availableSchemes[0] as SchemeType);
      setCurrentScheme(COLOR_PALETTES[value][availableSchemes[0]]);
      
      // Update matching outfits when color changes
      if (activeTab === "wardrobe" && userWardrobe.length > 0) {
        const matches = findMatchingItems(value, availableSchemes[0] as SchemeType, userWardrobe);
        setMatchingOutfits(matches);
      }
    }
  };
  
  const handleSchemeTypeChange = (value: SchemeType) => {
    setSchemeType(value);
    if (COLOR_PALETTES[baseColor][value]) {
      setCurrentScheme(COLOR_PALETTES[baseColor][value]);
      
      // Update matching outfits when scheme changes
      if (activeTab === "wardrobe" && userWardrobe.length > 0) {
        const matches = findMatchingItems(baseColor, value, userWardrobe);
        setMatchingOutfits(matches);
      }
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to wardrobe tab, generate matching outfits
    if (value === "wardrobe" && userWardrobe.length > 0) {
      const matches = findMatchingItems(baseColor, schemeType, userWardrobe);
      setMatchingOutfits(matches);
    }
  };
  
  const findMoreOutfits = () => {
    if (userWardrobe.length > 0) {
      const matches = findMatchingItems(baseColor, schemeType, userWardrobe);
      setMatchingOutfits(matches);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Palette size={20} className="text-purple-500" />
          Color Matching Assistant
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Info size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">About Color Matching</h4>
              <p className="text-sm text-gray-600">
                This assistant helps you find color combinations that work well together using color theory principles.
                Select a base color and a color scheme type to generate matching suggestions, or view matching items from your wardrobe.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue="theory" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="theory" className="flex items-center gap-1">
            <Palette size={16} />
            Color Theory
          </TabsTrigger>
          <TabsTrigger value="wardrobe" className="flex items-center gap-1">
            <Shirt size={16} />
            Wardrobe Matches
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="base-color">Base Color</Label>
                <Select 
                  value={baseColor} 
                  onValueChange={handleBaseColorChange}
                >
                  <SelectTrigger id="base-color" className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: color.toLowerCase() === "navy" 
                                ? "#000080" 
                                : color.toLowerCase() === "beige"
                                ? "#F5F5DC"
                                : color.toLowerCase() === "brown"
                                ? "#964B00"
                                : color.toLowerCase()
                            }} 
                          />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="scheme-type">Color Scheme</Label>
                <Select 
                  value={schemeType} 
                  onValueChange={(value: SchemeType) => handleSchemeTypeChange(value)}
                >
                  <SelectTrigger id="scheme-type" className="w-full">
                    <SelectValue placeholder="Select a scheme type" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemeTypeOptions
                      .filter(option => 
                        COLOR_PALETTES[baseColor] && 
                        COLOR_PALETTES[baseColor][option.value]
                      )
                      .map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateColorScheme} 
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" />
                Generate Color Scheme
              </Button>
            </div>
            
            <div className="space-y-4">
              {currentScheme && (
                <>
                  <div>
                    <p className="text-sm font-medium mb-2">{currentScheme.name} Color Scheme</p>
                    <p className="text-sm text-gray-600 mb-3">{currentScheme.description}</p>
                    <div className="flex gap-2">
                      {currentScheme.colors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-md border border-gray-200" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs mt-1">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100 mt-4">
                    <h4 className="text-sm font-medium mb-2">Outfit Suggestions</h4>
                    <p className="text-xs text-gray-600">
                      {CLOTHING_SUGGESTIONS[schemeType]}
                    </p>
                    <div className="mt-3 text-xs text-gray-700">
                      <div className="flex items-start gap-2 mb-1">
                        <Check size={14} className="text-green-500 mt-0.5" />
                        <span>Use {schemeType === 'neutral' ? 'your base color' : 'the dominant color'} for main pieces like shirts, pants, or dresses</span>
                      </div>
                      <div className="flex items-start gap-2 mb-1">
                        <Check size={14} className="text-green-500 mt-0.5" />
                        <span>Add {schemeType === 'neutral' ? 'neutral tones' : 'complementary colors'} with accessories (scarves, jewelry, bags)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check size={14} className="text-green-500 mt-0.5" />
                        <span>For a bold statement, try a color-blocked outfit using these colors</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setActiveTab("wardrobe")}
                    >
                      View matching items in your wardrobe
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wardrobe">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="base-color-wardrobe">Base Color</Label>
                  <Select 
                    value={baseColor} 
                    onValueChange={handleBaseColorChange}
                  >
                    <SelectTrigger id="base-color-wardrobe" className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ 
                                backgroundColor: color.toLowerCase() === "navy" 
                                  ? "#000080" 
                                  : color.toLowerCase() === "beige"
                                  ? "#F5F5DC"
                                  : color.toLowerCase() === "brown"
                                  ? "#964B00"
                                  : color.toLowerCase()
                              }} 
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="scheme-type-wardrobe">Color Scheme</Label>
                  <Select 
                    value={schemeType} 
                    onValueChange={(value: SchemeType) => handleSchemeTypeChange(value)}
                  >
                    <SelectTrigger id="scheme-type-wardrobe" className="w-full">
                      <SelectValue placeholder="Select a scheme type" />
                    </SelectTrigger>
                    <SelectContent>
                      {schemeTypeOptions
                        .filter(option => 
                          COLOR_PALETTES[baseColor] && 
                          COLOR_PALETTES[baseColor][option.value]
                        )
                        .map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={findMoreOutfits} 
                    className="flex-1"
                  >
                    <Search size={16} className="mr-2" />
                    Find Matching Outfits
                  </Button>
                </div>
                
                {matchingOutfits.length === 0 && userWardrobe.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-center">
                    <div className="flex justify-center mb-2">
                      <Target size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      No matching outfits found for this color scheme. Try a different color or scheme type.
                    </p>
                  </div>
                )}
                
                {userWardrobe.length === 0 && (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-center">
                    <div className="flex justify-center mb-2">
                      <Shirt size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Your wardrobe is empty. Add some clothing items first to get outfit recommendations.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                {matchingOutfits.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        Suggested Outfit from Your Wardrobe
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {matchingOutfits[0].map(item => (
                          <div key={item.id} className="relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full
