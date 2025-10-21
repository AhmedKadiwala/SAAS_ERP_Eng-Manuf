import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InviteUserModal = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'viewer',
    department: '',
    sendWelcomeEmail: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Team and department management' },
    { value: 'sales', label: 'Sales Representative', description: 'Customer and sales management' },
    { value: 'support', label: 'Support Agent', description: 'Customer support access' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const departmentOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Customer Support' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onInvite(formData);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'viewer',
        department: '',
        sendWelcomeEmail: true
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Invite Team Member</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send an invitation to join your team
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted/50"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={formData?.firstName}
              onChange={(e) => handleInputChange('firstName', e?.target?.value)}
              error={errors?.firstName}
              required
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={formData?.lastName}
              onChange={(e) => handleInputChange('lastName', e?.target?.value)}
              error={errors?.lastName}
              required
            />
          </div>

          {/* Role Selection */}
          <Select
            label="Role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            placeholder="Select a role"
          />

          {/* Department */}
          <Select
            label="Department"
            options={departmentOptions}
            value={formData?.department}
            onChange={(value) => handleInputChange('department', value)}
            placeholder="Select department"
            error={errors?.department}
            required
          />

          {/* Welcome Email Toggle */}
          <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="sendWelcomeEmail"
              checked={formData?.sendWelcomeEmail}
              onChange={(e) => handleInputChange('sendWelcomeEmail', e?.target?.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50"
            />
            <div>
              <label htmlFor="sendWelcomeEmail" className="text-sm font-medium text-foreground cursor-pointer">
                Send welcome email
              </label>
              <p className="text-xs text-muted-foreground">
                Include setup instructions and login details
              </p>
            </div>
          </div>

          {/* Submit Error */}
          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors?.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
              iconName="Send"
              iconPosition="left"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;