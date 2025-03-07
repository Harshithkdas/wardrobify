
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const authType = searchParams.get('type') || 'login';
  const navigate = useNavigate();
  
  const { login, register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (authType === 'login') {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(formData.name, formData.email, formData.password);
        // Stay on registration page as they might need to verify email
      }
    } catch (error) {
      // Error is handled in the auth hook
      console.error('Authentication error:', error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {authType === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="text-gray-600 mt-2">
          {authType === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Enter your information to get started'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {authType === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="h-11"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {authType === 'login' && (
              <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={authType === 'login' ? 'current-password' : 'new-password'}
              className="h-11 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {authType === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {authType === 'login' ? 'Sign in' : 'Create account'}
              <ArrowRight size={16} />
            </span>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          {authType === 'login' ? "Don't have an account? " : "Already have an account? "}
          <a 
            href={authType === 'login' ? '/auth?type=register' : '/auth?type=login'} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {authType === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;
