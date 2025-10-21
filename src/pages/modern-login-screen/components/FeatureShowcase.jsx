import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeatureShowcase = () => {
  const features = [
    {
      icon: 'BarChart3',
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance tracking for your business growth'
    },
    {
      icon: 'Users',
      title: 'Customer Management',
      description: 'Comprehensive CRM with lead pipeline and relationship tracking'
    },
    {
      icon: 'FileText',
      title: 'Smart Invoicing',
      description: 'Automated invoice generation with payment tracking and reminders'
    },
    {
      icon: 'Package',
      title: 'Inventory Control',
      description: 'Real-time stock management with automated reorder points'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="hidden lg:flex flex-col justify-center space-y-8 max-w-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="text-center lg:text-left"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Transform Your Business Operations
        </h2>
        <p className="text-xl text-white/80 leading-relaxed">
          Experience the power of modern ERP with beautiful design and intelligent automation
        </p>
      </motion.div>
      {/* Features Grid */}
      <motion.div
        className="grid gap-6"
        variants={containerVariants}
      >
        {features?.map((feature, index) => (
          <motion.div
            key={feature?.title}
            className="glass-card p-6 hover-lift cursor-pointer group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <Icon 
                  name={feature?.icon} 
                  size={24} 
                  color="white" 
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
                  {feature?.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {feature?.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
        variants={itemVariants}
      >
        {[
          { number: '10K+', label: 'Active Users' },
          { number: '99.9%', label: 'Uptime' },
          { number: '24/7', label: 'Support' }
        ]?.map((stat, index) => (
          <motion.div
            key={stat?.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
          >
            <div className="text-2xl font-bold text-white mb-1">{stat?.number}</div>
            <div className="text-sm text-white/70">{stat?.label}</div>
          </motion.div>
        ))}
      </motion.div>
      {/* Testimonial */}
      <motion.div
        className="glass-card p-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
            <Icon name="Quote" size={16} color="white" />
          </div>
          <div>
            <div className="text-white font-medium">Sarah Johnson</div>
            <div className="text-white/70 text-sm">CEO, TechStart Inc</div>
          </div>
        </div>
        <p className="text-white/80 text-sm italic leading-relaxed">
          "ModernERP transformed how we manage our business. The interface is beautiful and the features are exactly what we needed to scale efficiently."
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FeatureShowcase;