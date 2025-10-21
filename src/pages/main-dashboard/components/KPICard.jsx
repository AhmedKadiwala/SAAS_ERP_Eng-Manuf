import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, previousValue, icon, gradient, trend, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const trendPercentage = previousValue ? ((value - previousValue) / previousValue * 100)?.toFixed(1) : 0;
  const isPositive = trendPercentage >= 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`kpi-${title?.replace(/\s+/g, '-')?.toLowerCase()}`);
    if (element) observer?.observe(element);

    return () => observer?.disconnect();
  }, [title]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(increment * step, value);
        setDisplayValue(current);

        if (step >= steps) {
          clearInterval(timer);
          setDisplayValue(value);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const formatValue = (val) => {
    if (val >= 1000000) {
      return (val / 1000000)?.toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000)?.toFixed(1) + 'K';
    }
    return Math.round(val)?.toLocaleString();
  };

  return (
    <motion.div
      id={`kpi-${title?.replace(/\s+/g, '-')?.toLowerCase()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 hover-lift cursor-pointer group"
    >
      <div className={`absolute inset-0 opacity-10 rounded-xl ${gradient}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient} shadow-glass`}>
            <Icon name={icon} size={24} color="white" />
          </div>
          
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon 
              name={isPositive ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
            />
            <span>{Math.abs(trendPercentage)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-foreground">
              {prefix}{formatValue(displayValue)}{suffix}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            vs {prefix}{formatValue(previousValue)}{suffix} last month
          </p>
        </div>

        {trend && (
          <div className="mt-4 h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              <defs>
                <linearGradient id={`gradient-${title?.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <motion.path
                d={trend}
                fill="none"
                stroke={`url(#gradient-${title?.replace(/\s+/g, '-')})`}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isVisible ? 1 : 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;