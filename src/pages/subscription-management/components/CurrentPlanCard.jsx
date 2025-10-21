import React from 'react';
import Icon from '../../../components/AppIcon';

const CurrentPlanCard = ({ currentPlan }) => {
  const getDaysUntilRenewal = () => {
    const renewalDate = new Date(currentPlan.nextBilling);
    const today = new Date();
    const diffTime = renewalDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilRenewal();

  return (
    <div className="glass-card p-6 bg-gradient-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon name="Crown" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentPlan?.name}</h3>
              <p className="text-white/80 text-sm">Current Plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">${currentPlan?.price}</p>
            <p className="text-white/80 text-sm">/{currentPlan?.billing}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/80 text-xs uppercase tracking-wide">Next Billing</p>
            <p className="text-white font-semibold">{currentPlan?.nextBilling}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/80 text-xs uppercase tracking-wide">Days Left</p>
            <p className="text-white font-semibold">{daysLeft} days</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-white/90 text-sm">Active Subscription</span>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150">
            Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanCard;