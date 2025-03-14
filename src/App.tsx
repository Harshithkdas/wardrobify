import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Features from './pages/Features';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Wardrobe from './pages/Wardrobe';
import OutfitBuilder from './pages/OutfitBuilder';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './hooks/useAuth';
// Add the new CategoryPage import
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/wardrobe/:category" element={<CategoryPage />} />
          <Route path="/outfit-builder" element={<OutfitBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
