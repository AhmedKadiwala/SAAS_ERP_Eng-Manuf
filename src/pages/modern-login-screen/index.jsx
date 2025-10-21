import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ParticleBackground from './components/ParticleBackground';
import LoginCard from './components/LoginCard';
import FeatureShowcase from './components/FeatureShowcase';
import LoadingOverlay from './components/LoadingOverlay';

const ModernLoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    // Preload critical resources
    const preloadImages = () => {
      const imageUrls = [
        '/assets/images/no_image.png'
      ];
      
      imageUrls?.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages();

    // Add custom cursor effects
    const addCursorEffects = () => {
      const interactiveElements = document.querySelectorAll('button, input, a, [role="button"]');
      
      interactiveElements?.forEach(element => {
        element?.addEventListener('mouseenter', () => {
          document.body.style.cursor = 'pointer';
        });
        
        element?.addEventListener('mouseleave', () => {
          document.body.style.cursor = 'default';
        });
      });
    };

    const timer = setTimeout(addCursorEffects, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle global loading states
  const handleGlobalLoading = (isLoading, message = '') => {
    setIsLoading(isLoading);
    setLoadingMessage(message);
  };

  return (
    <>
      <Helmet>
        <title>Sign In - ModernERP | Business Management Suite</title>
        <meta name="description" content="Access your ModernERP dashboard with secure authentication. Manage customers, sales, inventory, and analytics in one beautiful platform." />
        <meta name="keywords" content="ERP login, business management, CRM access, sales dashboard" />
        <meta property="og:title" content="ModernERP - Sign In to Your Business Suite" />
        <meta property="og:description" content="Secure access to your comprehensive business management platform" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/modern-login-screen" />
      </Helmet>
      <div className="min-h-screen relative overflow-hidden bg-gradient-primary">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Main Content */}
        <motion.div
          className="relative z-10 min-h-screen flex items-center justify-center lg:justify-between lg:px-12 xl:px-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Feature Showcase - Desktop Only */}
          <div className="hidden lg:block lg:w-1/2 xl:w-2/5">
            <FeatureShowcase />
          </div>

          {/* Login Section */}
          <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              <LoginCard onLoadingChange={handleGlobalLoading} />
              
              {/* Mobile Feature Highlights */}
              <motion.div
                className="lg:hidden mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="grid grid-cols-2 gap-4 text-white/80">
                  <div className="text-center">
                    <div className="text-lg font-semibold">10K+</div>
                    <div className="text-xs">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">99.9%</div>
                    <div className="text-xs">Uptime</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-accent rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-primary rounded-full opacity-20 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          <LoadingOverlay 
            isVisible={isLoading} 
            message={loadingMessage || "Authenticating..."} 
          />
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="text-center text-white/60 text-xs">
            <p>&copy; {new Date()?.getFullYear()} ModernERP. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="hover:text-white/80 transition-colors duration-150">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-white/80 transition-colors duration-150">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-white/80 transition-colors duration-150">
                Support
              </button>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default ModernLoginScreen;