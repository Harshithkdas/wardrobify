
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/3 -left-40 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 mb-6">
              <Sparkles size={14} className="mr-2" />
              <span className="text-xs font-medium">Revolutionize Your Wardrobe</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Your Personal
              <br /> 
              <span className="text-black">Wardrobe Assistant</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Effortlessly manage your clothing, create stylish outfits, and plan your looks ahead of time with our intuitive wardrobe platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/auth?type=register">
                <Button size="lg" className="rounded-full gap-2 px-6">
                  Get Started
                  <ChevronRight size={16} />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="rounded-full gap-2 px-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Image/Visual */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative glass-effect rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Wardrobe organization" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Effortless Style</h3>
                  <p className="text-sm text-white/80">Organize, create, and plan with ease</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
