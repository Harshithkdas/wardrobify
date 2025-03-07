
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Scroll indicator */}
        <motion.div 
          className="flex justify-center -mt-10 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <button 
            onClick={scrollToFeatures}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300"
          >
            <ArrowDown size={20} className="text-gray-700" />
          </button>
        </motion.div>
        
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <div className="mb-4">
                  <span className="text-yellow-400 text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-600 mb-4">
                  "Wardrobify has transformed how I plan my outfits. I can finally see all my clothes in one place and create combinations I never thought of!"
                </p>
                <div>
                  <p className="font-medium">Sarah J.</p>
                  <p className="text-sm text-gray-500">Fashion Blogger</p>
                </div>
              </motion.div>
              
              {/* Testimonial 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <div className="mb-4">
                  <span className="text-yellow-400 text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-600 mb-4">
                  "As someone who travels frequently, this app has been a game-changer. I can plan my trip outfits in advance and pack exactly what I need."
                </p>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </motion.div>
              
              {/* Testimonial 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <div className="mb-4">
                  <span className="text-yellow-400 text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-600 mb-4">
                  "The weather integration is brilliant! I no longer have to worry about checking the forecast and then figuring out what to wear."
                </p>
                <div>
                  <p className="font-medium">Emily C.</p>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto p-8 rounded-3xl glass-effect"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Wardrobe?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already simplifying their outfit planning and making the most of their wardrobes.
              </p>
              <a 
                href="/auth?type=register" 
                className="inline-block px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Get Started For Free
              </a>
              <p className="mt-4 text-sm text-gray-500">No credit card required</p>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
