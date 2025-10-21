import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CompanyDetailsStep = ({ data, onUpdate, onNext, errors }) => {
  const [formData, setFormData] = useState({
    companyName: data?.companyName || '',
    industry: data?.industry || '',
    companySize: data?.companySize || '',
    website: data?.website || '',
    phone: data?.phone || '',
    address: data?.address || '',
    city: data?.city || '',
    country: data?.country || '',
    timezone: data?.timezone || ''
  });

  const industryOptions = [
    { value: 'technology', label: 'Technology & Software' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'other', label: 'Other' }
  ];

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'in', label: 'India' },
    { value: 'other', label: 'Other' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onNext();
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
          <Icon name="Building" size={32} color="white" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold gradient-text mb-2">
          Tell us about your company
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          Help us customize ModernERP for your business needs
        </motion.p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Input
              label="Company Name"
              type="text"
              placeholder="Enter your company name"
              value={formData?.companyName}
              onChange={(e) => handleInputChange('companyName', e?.target?.value)}
              error={errors?.companyName}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select
              label="Industry"
              placeholder="Select your industry"
              options={industryOptions}
              value={formData?.industry}
              onChange={(value) => handleInputChange('industry', value)}
              error={errors?.industry}
              required
              searchable
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select
              label="Company Size"
              placeholder="Select company size"
              options={companySizeOptions}
              value={formData?.companySize}
              onChange={(value) => handleInputChange('companySize', value)}
              error={errors?.companySize}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              value={formData?.website}
              onChange={(e) => handleInputChange('website', e?.target?.value)}
              error={errors?.website}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <Input
              label="Address"
              type="text"
              placeholder="Enter your business address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              error={errors?.address}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="City"
              type="text"
              placeholder="Enter city"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              error={errors?.city}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Select
              label="Country"
              placeholder="Select country"
              options={countryOptions}
              value={formData?.country}
              onChange={(value) => handleInputChange('country', value)}
              error={errors?.country}
              searchable
            />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <Select
              label="Timezone"
              placeholder="Select your timezone"
              options={timezoneOptions}
              value={formData?.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
              error={errors?.timezone}
              searchable
            />
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex justify-end pt-6">
          <Button
            type="submit"
            variant="default"
            size="lg"
            iconName="ArrowRight"
            iconPosition="right"
            className="min-w-32"
          >
            Continue
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CompanyDetailsStep;