import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentMethods = ({ paymentMethods, onAddMethod, onEditMethod, onDeleteMethod, onSetDefault }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const getCardIcon = (type) => {
    const icons = {
      visa: 'CreditCard',
      mastercard: 'CreditCard',
      amex: 'CreditCard',
      discover: 'CreditCard'
    };
    return icons?.[type?.toLowerCase()] || 'CreditCard';
  };

  const getCardColor = (type) => {
    const colors = {
      visa: 'text-blue-600',
      mastercard: 'text-red-600',
      amex: 'text-green-600',
      discover: 'text-orange-600'
    };
    return colors?.[type?.toLowerCase()] || 'text-muted-foreground';
  };

  const PaymentMethodCard = ({ method }) => (
    <div className="glass-card p-4 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted/30 rounded-lg flex items-center justify-center">
            <Icon name={getCardIcon(method?.type)} size={20} className={getCardColor(method?.type)} />
          </div>
          <div>
            <p className="font-medium text-foreground">•••• •••• •••• {method?.last4}</p>
            <p className="text-sm text-muted-foreground capitalize">{method?.type} • Expires {method?.expiry}</p>
          </div>
        </div>
        
        {method?.isDefault && (
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Default
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-muted-foreground">Verified</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!method?.isDefault && (
            <button
              onClick={() => onSetDefault(method?.id)}
              className="text-xs text-primary hover:text-primary/80 font-medium"
            >
              Set Default
            </button>
          )}
          <button
            onClick={() => onEditMethod(method)}
            className="p-1 hover:bg-muted/50 rounded-md transition-colors duration-150"
          >
            <Icon name="Edit2" size={14} />
          </button>
          <button
            onClick={() => onDeleteMethod(method?.id)}
            className="p-1 hover:bg-error/10 text-error rounded-md transition-colors duration-150"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const AddPaymentForm = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Add Payment Method</h3>
        <button
          onClick={() => setShowAddForm(false)}
          className="p-1 hover:bg-muted/50 rounded-md transition-colors duration-150"
        >
          <Icon name="X" size={16} />
        </button>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full pl-4 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
            />
            <Icon name="CreditCard" size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="setDefault"
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
          />
          <label htmlFor="setDefault" className="text-sm text-foreground">
            Set as default payment method
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button variant="default" fullWidth>
            Add Payment Method
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
        {!showAddForm && (
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddForm(true)}
          >
            Add Method
          </Button>
        )}
      </div>
      {showAddForm && <AddPaymentForm />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods?.map((method) => (
          <PaymentMethodCard key={method?.id} method={method} />
        ))}
      </div>
      <div className="glass-card p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">Secure Payment Processing</p>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;