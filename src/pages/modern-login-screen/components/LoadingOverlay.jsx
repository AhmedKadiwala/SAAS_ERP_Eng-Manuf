import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = "Authenticating..." }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="glass-card p-8 max-w-sm mx-4 text-center"
      >
        {/* Animated Logo */}
        <motion.div
          className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glass"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Icon name="Zap" size={32} color="white" strokeWidth={2.5} />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Message */}
        <motion.p
          className="text-foreground font-medium mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>

        <p className="text-sm text-muted-foreground">
          Please wait while we verify your credentials
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2]?.map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;