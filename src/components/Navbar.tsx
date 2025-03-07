
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isAuthenticated = false; // Replace with actual auth state

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-semibold tracking-tight"
            >
              Wardrobify
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  to="/" 
                  className={`transition-all duration-200 hover:text-black ${
                    location.pathname === '/' ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  className={`transition-all duration-200 hover:text-black ${
                    location.pathname === '/features' ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className={`transition-all duration-200 hover:text-black ${
                    location.pathname === '/pricing' ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" variant="ghost" className="flex items-center gap-2">
                  <User size={16} />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?type=login">
                  <Button size="sm" variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?type=register">
                  <Button size="sm" variant="default">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass-effect border-t"
        >
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link 
              to="/" 
              className={`block py-2 ${
                location.pathname === '/' ? 'text-black font-medium' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`block py-2 ${
                location.pathname === '/features' ? 'text-black font-medium' : 'text-gray-600'
              }`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`block py-2 ${
                location.pathname === '/pricing' ? 'text-black font-medium' : 'text-gray-600'
              }`}
            >
              Pricing
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-gray-600"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/auth?type=login" 
                    className="block py-2 text-gray-600"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth?type=register"
                    className="block py-2 text-gray-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
