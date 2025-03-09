
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-semibold">
              Wardrobify
            </Link>
            <p className="mt-4 text-gray-600">
              Your personal wardrobe assistant, helping you organize clothing and plan outfits effortlessly.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/features" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/roadmap" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookie-policy" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Wardrobify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
