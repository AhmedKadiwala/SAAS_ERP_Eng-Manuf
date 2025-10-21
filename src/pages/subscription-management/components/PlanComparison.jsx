import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparison = ({ plans, currentPlanId, onPlanSelect }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const PlanCard = ({ plan, isCurrentPlan, isPopular }) => {
    const price = billingCycle === 'monthly' ? plan?.monthlyPrice : plan?.yearlyPrice;
    const savings = billingCycle === 'yearly' ? Math.round(((plan?.monthlyPrice * 12) - plan?.yearlyPrice) / (plan?.monthlyPrice * 12) * 100) : 0;

    return (
      <div className={`
        relative glass-card p-6 transition-all duration-300 hover-lift
        ${isCurrentPlan ? 'border-2 border-primary bg-primary/5' : ''}
        ${isPopular ? 'border-2 border-accent bg-accent/5' : ''}
      `}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-accent text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute -top-3 right-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              Current Plan
            </span>
          </div>
        )}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name={plan?.icon} size={32} color="white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{plan?.name}</h3>
          <p className="text-muted-foreground text-sm">{plan?.description}</p>
        </div>
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-4xl font-bold text-foreground">${price}</span>
            <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          {billingCycle === 'yearly' && savings > 0 && (
            <p className="text-success text-sm font-medium mt-1">
              Save {savings}% annually
            </p>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {plan?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Check" size={12} className="text-success" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Users</span>
            <span className="font-medium">{plan?.limits?.users}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">{plan?.limits?.storage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">API Calls</span>
            <span className="font-medium">{plan?.limits?.apiCalls}</span>
          </div>
        </div>
        <Button
          variant={isCurrentPlan ? "outline" : (isPopular ? "default" : "secondary")}
          fullWidth
          onClick={() => onPlanSelect(plan)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan?.name}`}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground mb-6">
          Select the perfect plan for your business needs
        </p>

        <div className="inline-flex bg-muted/30 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
              ${billingCycle === 'monthly' ?'bg-background text-foreground shadow-elevated' :'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 relative
              ${billingCycle === 'yearly' ?'bg-background text-foreground shadow-elevated' :'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <PlanCard
            key={plan?.id}
            plan={plan}
            isCurrentPlan={plan?.id === currentPlanId}
            isPopular={plan?.popular}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanComparison;