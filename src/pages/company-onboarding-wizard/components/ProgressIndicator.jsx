import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps, onStepClick }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = stepNumber <= currentStep;

          return (
            <motion.button
              key={step?.id}
              onClick={() => isClickable && onStepClick(stepNumber)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center space-y-2 transition-all duration-300
                ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
              `}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {/* Step Circle */}
              <div className={`
                relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 shadow-elevated
                ${isActive 
                  ? 'bg-gradient-primary border-primary text-white shadow-glass' 
                  : isCompleted 
                    ? 'bg-success border-success text-white' :'bg-card border-border text-muted-foreground hover:border-primary/50'
                }
              `}>
                {isCompleted ? (
                  <Icon name="Check" size={20} className="text-white" />
                ) : (
                  <span className="font-semibold text-sm">{stepNumber}</span>
                )}
                
                {/* Active Step Pulse */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              {/* Step Label */}
              <div className="text-center">
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}
                `}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-24 leading-tight">
                  {step?.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;