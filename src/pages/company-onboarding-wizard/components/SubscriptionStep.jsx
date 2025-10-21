import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SubscriptionStep = ({ data, onUpdate, onBack, onComplete, errors }) => {
  const [selectedPlan, setSelectedPlan] = useState(data?.selectedPlan || '');
  const [billingCycle, setBillingCycle] = useState(data?.billingCycle || 'monthly');
  const [addOns, setAddOns] = useState(data?.addOns || []);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 5 team members',
        '1,000 customers',
        'Basic CRM features',
        'Email support',
        '5GB storage',
        'Mobile app access'
      ],
      popular: false,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Up to 25 team members',
        '10,000 customers',
        'Advanced CRM & Sales Pipeline',
        'Priority support',
        '50GB storage',
        'Advanced analytics',
        'Custom integrations',
        'API access'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited team members',
        'Unlimited customers',
        'Full ERP suite',
        'Dedicated support',
        'Unlimited storage',
        'Advanced security',
        'Custom development',
        'White-label options',
        'SLA guarantee'
      ],
      popular: false,
      color: 'from-pink-500 to-red-600'
    }
  ];

  const addOnOptions = [
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Detailed reports and business intelligence',
      monthlyPrice: 19,
      yearlyPrice: 190
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Full REST API for custom integrations',
      monthlyPrice: 29,
      yearlyPrice: 290
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 phone and chat support',
      monthlyPrice: 39,
      yearlyPrice: 390
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    onUpdate({ selectedPlan: planId, billingCycle, addOns });
  };

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
    onUpdate({ selectedPlan, billingCycle: cycle, addOns });
  };

  const handleAddOnToggle = (addOnId) => {
    const updatedAddOns = addOns?.includes(addOnId)
      ? addOns?.filter(id => id !== addOnId)
      : [...addOns, addOnId];
    
    setAddOns(updatedAddOns);
    onUpdate({ selectedPlan, billingCycle, addOns: updatedAddOns });
  };

  const calculateTotal = () => {
    const selectedPlanData = plans?.find(p => p?.id === selectedPlan);
    if (!selectedPlanData) return 0;

    const planPrice = billingCycle === 'yearly' 
      ? selectedPlanData?.yearlyPrice 
      : selectedPlanData?.monthlyPrice;

    const addOnPrice = addOns?.reduce((total, addOnId) => {
      const addOn = addOnOptions?.find(a => a?.id === addOnId);
      return total + (billingCycle === 'yearly' ? addOn?.yearlyPrice : addOn?.monthlyPrice);
    }, 0);

    return planPrice + addOnPrice;
  };

  const handleComplete = () => {
    if (selectedPlan) {
      onComplete();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          variants={itemVariants}
          className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glass"
        >
          <Icon name="CreditCard" size={32} color="white" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold gradient-text mb-2">
          Choose your plan
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          Select the perfect plan for your business needs
        </motion.p>
      </div>
      {/* Billing Cycle Toggle */}
      <motion.div variants={itemVariants} className="flex justify-center mb-8">
        <div className="glass-card p-2 border border-border/50">
          <div className="flex space-x-1">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${billingCycle === 'monthly' ?'bg-primary text-primary-foreground shadow-elevated' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative
                ${billingCycle === 'yearly' ?'bg-primary text-primary-foreground shadow-elevated' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </motion.div>
      {/* Plans Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans?.map((plan) => {
          const isSelected = selectedPlan === plan?.id;
          const price = billingCycle === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice;
          const originalPrice = billingCycle === 'yearly' ? plan?.monthlyPrice * 12 : null;

          return (
            <motion.div
              key={plan?.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative glass-card p-6 cursor-pointer transition-all duration-300 border-2
                ${isSelected 
                  ? 'border-primary shadow-glass bg-primary/5' 
                  : 'border-border/50 hover:border-primary/30'
                }
                ${plan?.popular ? 'ring-2 ring-accent/50' : ''}
              `}
              onClick={() => handlePlanSelect(plan?.id)}
            >
              {plan?.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-accent text-white px-4 py-1 rounded-full text-sm font-medium shadow-elevated">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan?.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon name="Zap" size={24} color="white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{plan?.name}</h3>
                <p className="text-muted-foreground text-sm">{plan?.description}</p>
              </div>
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && originalPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">${originalPrice}/year</span>
                    <span className="text-success ml-2">Save ${originalPrice - price}</span>
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3 text-sm">
                    <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={isSelected ? "default" : "outline"}
                fullWidth
                className="mt-auto"
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>
      {/* Add-ons */}
      {selectedPlan && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-6 border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Icon name="Plus" size={20} className="text-primary" />
            <span>Add-ons</span>
          </h3>

          <div className="space-y-4">
            {addOnOptions?.map((addOn) => {
              const isSelected = addOns?.includes(addOn?.id);
              const price = billingCycle === 'yearly' ? addOn?.yearlyPrice : addOn?.monthlyPrice;

              return (
                <div
                  key={addOn?.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-150 cursor-pointer
                    ${isSelected 
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/30'
                    }
                  `}
                  onClick={() => handleAddOnToggle(addOn?.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleAddOnToggle(addOn?.id)}
                      />
                      <div>
                        <h4 className="font-medium">{addOn?.name}</h4>
                        <p className="text-sm text-muted-foreground">{addOn?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${price}</p>
                      <p className="text-xs text-muted-foreground">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      {/* Total Summary */}
      {selectedPlan && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 border-2 border-primary/20 bg-primary/5"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-sm text-muted-foreground">
                {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${calculateTotal()}</p>
              <p className="text-sm text-muted-foreground">
                /{billingCycle === 'yearly' ? 'year' : 'month'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back
        </Button>

        <Button
          onClick={handleComplete}
          disabled={!selectedPlan}
          variant="default"
          size="lg"
          iconName="Check"
          iconPosition="right"
          className="min-w-40"
        >
          Complete Setup
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionStep;