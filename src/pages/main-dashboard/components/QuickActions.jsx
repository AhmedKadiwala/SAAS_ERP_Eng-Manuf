import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'customer',
      label: 'Add Customer',
      icon: 'UserPlus',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      route: '/customer-directory',
      description: 'Create new customer profile'
    },
    {
      id: 'invoice',
      label: 'Generate Invoice',
      icon: 'FileText',
      gradient: 'bg-gradient-to-r from-green-500 to-teal-600',
      route: '/modern-invoice-generator',
      description: 'Create and send invoice'
    },
    {
      id: 'lead',
      label: 'Add Lead',
      icon: 'TrendingUp',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      route: '/lead-pipeline-management',
      description: 'Track new sales opportunity'
    },
    {
      id: 'product',
      label: 'Add Product',
      icon: 'Package',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-600',
      route: '/product-inventory-hub',
      description: 'Manage product inventory'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action?.route);
    setIsExpanded(false);
  };

  const primaryAction = quickActions?.[0];

  return (
    <div className="fixed bottom-6 right-6 z-400">
      {/* Expanded Actions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {quickActions?.slice(1)?.reverse()?.map((action, index) => (
              <motion.button
                key={action?.id}
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => handleActionClick(action)}
                className="flex items-center space-x-3 bg-card/95 backdrop-blur-glass border border-border rounded-xl px-4 py-3 shadow-floating hover:shadow-glass hover:scale-105 transition-all duration-150 group min-w-48"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action?.gradient} shadow-elevated`}>
                  <Icon name={action?.icon} size={18} color="white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{action?.label}</p>
                  <p className="text-xs text-muted-foreground">{action?.description}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Action Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-full shadow-floating hover:shadow-glass transition-all duration-150 ripple group focus:outline-none focus:ring-4 focus:ring-primary/30 ${primaryAction?.gradient}`}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon 
            name={isExpanded ? 'X' : 'Plus'} 
            size={24} 
            color="white" 
            className="group-hover:scale-110 transition-transform duration-150"
          />
        </motion.div>
      </motion.button>
      {/* Action Count Indicator */}
      {!isExpanded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-elevated"
        >
          <span className="text-xs font-bold text-accent-foreground">{quickActions?.length}</span>
        </motion.div>
      )}
      {/* Mobile Backdrop */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;