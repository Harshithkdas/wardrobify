
import { useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const authType = searchParams.get('type') || 'login';
  const { user } = useAuth();
  
  useEffect(() => {
    // Update page title based on auth type
    document.title = authType === 'login' 
      ? 'Sign In | Wardrobify' 
      : 'Create Account | Wardrobify';
  }, [authType]);
  
  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <AuthForm />
          </div>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-screen bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-screen bg-gradient-to-t from-purple-50 to-transparent opacity-50" />
    </div>
  );
};

export default Auth;
