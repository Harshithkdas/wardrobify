import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Calendar, Palette, PlusCircle, Settings, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import ClothingGrid from '@/components/ClothingGrid';
import { WeatherWidget } from '@/components/WeatherWidget';
import { CalendarWidget } from '@/components/CalendarWidget';
import { OutfitAdvisor } from '@/components/OutfitAdvisor';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth?type=login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: '-100%' } : { x: 0 }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className={`fixed md:relative z-20 w-64 h-screen bg-white border-r border-gray-200 flex flex-col ${
          isMobile && sidebarOpen ? 'shadow-xl' : ''
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold">Wardrobify</h1>
          <p className="text-sm text-gray-500">Your virtual wardrobe</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'wardrobe' 
                ? 'bg-blue-50 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Shirt size={20} />
            <span>My Wardrobe</span>
          </button>
          
          <button
            onClick={() => setActiveTab('outfits')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'outfits' 
                ? 'bg-blue-50 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Palette size={20} />
            <span>Outfit Builder</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'calendar' 
                ? 'bg-blue-50 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('advisor')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'advisor' 
                ? 'bg-blue-50 text-blue-700' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MessageSquare size={20} />
            <span>Outfit Advisor</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <Settings size={16} />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold">
            {activeTab === 'wardrobe' && 'My Wardrobe'}
            {activeTab === 'outfits' && 'Outfit Builder'}
            {activeTab === 'calendar' && 'Calendar'}
            {activeTab === 'advisor' && 'Outfit Advisor'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'wardrobe' && 'Manage and organize your clothing items'}
            {activeTab === 'outfits' && 'Create and save outfit combinations'}
            {activeTab === 'calendar' && 'Plan your outfits by date'}
            {activeTab === 'advisor' && 'Get AI-powered outfit recommendations'}
          </p>
        </header>
        
        {/* Weather widget - always visible except in advisor tab */}
        {activeTab !== 'advisor' && (
          <div className="mb-6">
            <WeatherWidget />
          </div>
        )}
        
        {/* Tab content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Main content area - takes full width now */}
          <div className="col-span-1">
            {activeTab === 'wardrobe' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ClothingGrid categoryFilter={null} />
              </motion.div>
            )}
            
            {activeTab === 'outfits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <Link to="/outfit-builder" className="inline-block">
                  <Button size="lg" className="gap-2">
                    <PlusCircle size={18} />
                    Create New Outfit
                  </Button>
                </Link>
                
                <div className="mt-8 text-center py-12">
                  <p className="text-gray-500">
                    You haven't created any outfits yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first outfit to get started.
                  </p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-medium mb-4">Calendar View</h2>
                <p className="text-gray-500 mb-6">
                  Plan your outfits by date and get weather-based recommendations.
                </p>
                
                <CalendarWidget />
              </motion.div>
            )}
            
            {activeTab === 'advisor' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm h-[600px]"
              >
                <OutfitAdvisor />
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
