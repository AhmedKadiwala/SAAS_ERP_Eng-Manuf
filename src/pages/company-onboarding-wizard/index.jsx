import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/NotificationToast';
import Icon from '../../components/AppIcon';
import ProgressIndicator from './components/ProgressIndicator';
import CompanyDetailsStep from './components/CompanyDetailsStep';
import TeamSetupStep from './components/TeamSetupStep';
import SubscriptionStep from './components/SubscriptionStep';

const CompanyOnboardingWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [wizardData, setWizardData] = useState({
    companyDetails: {},
    teamSetup: { teamMembers: [] },
    subscription: { selectedPlan: '', billingCycle: 'monthly', addOns: [] }
  });

  const steps = [
    {
      id: 'company',
      title: 'Company Details',
      description: 'Basic information',
      component: CompanyDetailsStep
    },
    {
      id: 'team',
      title: 'Team Setup',
      description: 'Invite members',
      component: TeamSetupStep
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Choose plan',
      component: SubscriptionStep
    }
  ];

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding-progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWizardData(parsed?.data || wizardData);
        setCurrentStep(parsed?.currentStep || 1);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const progressData = {
      currentStep,
      data: wizardData,
      timestamp: new Date()?.toISOString()
    };
    localStorage.setItem('onboarding-progress', JSON.stringify(progressData));
  }, [currentStep, wizardData]);

  const validateStep = (stepNumber, data) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!data?.companyName?.trim()) newErrors.companyName = 'Company name is required';
        if (!data?.industry) newErrors.industry = 'Please select an industry';
        if (!data?.companySize) newErrors.companySize = 'Please select company size';
        break;
      case 2:
        // Team setup is optional, no validation needed
        break;
      case 3:
        if (!data?.selectedPlan) newErrors.selectedPlan = 'Please select a subscription plan';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleStepUpdate = (stepKey, data) => {
    setWizardData(prev => ({
      ...prev,
      [stepKey]: { ...prev?.[stepKey], ...data }
    }));
    setErrors({});
  };

  const handleNext = () => {
    const stepKey = ['companyDetails', 'teamSetup', 'subscription']?.[currentStep - 1];
    const stepData = wizardData?.[stepKey];

    if (validateStep(currentStep, stepData)) {
      if (currentStep < steps?.length) {
        setCurrentStep(prev => prev + 1);
        toast?.success(`Step ${currentStep} completed successfully!`);
      }
    } else {
      toast?.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved progress
      localStorage.removeItem('onboarding-progress');
      
      toast?.success('Welcome to ModernERP! Your account is ready.', {
        duration: 4000
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/main-dashboard');
      }, 1500);
      
    } catch (error) {
      toast?.error('Failed to complete setup. Please try again.');
      setIsLoading(false);
    }
  };

  const getCurrentStepComponent = () => {
    const stepKey = ['companyDetails', 'teamSetup', 'subscription']?.[currentStep - 1];
    const StepComponent = steps?.[currentStep - 1]?.component;

    const commonProps = {
      data: wizardData?.[stepKey],
      onUpdate: (data) => handleStepUpdate(stepKey, data),
      errors: errors
    };

    switch (currentStep) {
      case 1:
        return <StepComponent {...commonProps} onNext={handleNext} />;
      case 2:
        return <StepComponent {...commonProps} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepComponent {...commonProps} onBack={handleBack} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glass">
            <Icon name="Loader2" size={40} color="white" className="animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Setting up your account...</h2>
            <p className="text-muted-foreground">This will only take a moment</p>
          </div>
          <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-accent rounded-full opacity-10 blur-3xl" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glass">
                <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold gradient-text">ModernERP Setup</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Let's get your business up and running in just a few steps
            </p>
          </motion.div>

          {/* Main Wizard Card */}
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="glass-card p-8 border-2 border-primary/20 shadow-glass max-w-4xl mx-auto"
          >
            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps?.length}
              steps={steps}
              onStepClick={handleStepClick}
            />

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {getCurrentStepComponent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@modernerp.com" className="text-primary hover:underline">
                support@modernerp.com
              </a>
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboardingWizard;