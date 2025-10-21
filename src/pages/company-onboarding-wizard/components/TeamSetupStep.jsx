import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TeamSetupStep = ({ data, onUpdate, onNext, onBack, errors }) => {
  const [teamMembers, setTeamMembers] = useState(data?.teamMembers || []);
  const [newMember, setNewMember] = useState({
    email: '',
    role: '',
    permissions: []
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Team and project management' },
    { value: 'sales', label: 'Sales Representative', description: 'Customer and lead management' },
    { value: 'support', label: 'Support Agent', description: 'Customer support access' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const permissionOptions = [
    { id: 'customers', label: 'Customer Management', description: 'View and manage customer data' },
    { id: 'leads', label: 'Lead Management', description: 'Access sales pipeline' },
    { id: 'invoices', label: 'Invoice Management', description: 'Create and manage invoices' },
    { id: 'reports', label: 'Reports & Analytics', description: 'View business reports' },
    { id: 'inventory', label: 'Inventory Management', description: 'Manage products and stock' },
    { id: 'settings', label: 'System Settings', description: 'Configure system preferences' }
  ];

  const handleAddMember = () => {
    if (newMember?.email && newMember?.role) {
      const updatedMembers = [...teamMembers, { ...newMember, id: Date.now() }];
      setTeamMembers(updatedMembers);
      onUpdate({ teamMembers: updatedMembers });
      setNewMember({ email: '', role: '', permissions: [] });
    }
  };

  const handleRemoveMember = (id) => {
    const updatedMembers = teamMembers?.filter(member => member?.id !== id);
    setTeamMembers(updatedMembers);
    onUpdate({ teamMembers: updatedMembers });
  };

  const handlePermissionChange = (permissionId, checked) => {
    const updatedPermissions = checked
      ? [...newMember?.permissions, permissionId]
      : newMember?.permissions?.filter(p => p !== permissionId);
    
    setNewMember({ ...newMember, permissions: updatedPermissions });
  };

  const handleSkip = () => {
    onUpdate({ teamMembers: [] });
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

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-error/10 text-error border-error/20',
      manager: 'bg-warning/10 text-warning border-warning/20',
      sales: 'bg-success/10 text-success border-success/20',
      support: 'bg-primary/10 text-primary border-primary/20',
      viewer: 'bg-muted/50 text-muted-foreground border-border'
    };
    return colors?.[role] || colors?.viewer;
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
          className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glass"
        >
          <Icon name="Users" size={32} color="white" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold gradient-text mb-2">
          Invite your team
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted-foreground">
          Add team members and assign roles to get started together
        </motion.p>
      </div>
      {/* Add New Member Form */}
      <motion.div variants={itemVariants} className="glass-card p-6 border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <span>Add Team Member</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={newMember?.email}
            onChange={(e) => setNewMember({ ...newMember, email: e?.target?.value })}
            error={errors?.email}
            required
          />

          <Select
            label="Role"
            placeholder="Select role"
            options={roleOptions}
            value={newMember?.role}
            onChange={(value) => setNewMember({ ...newMember, role: value })}
            error={errors?.role}
            required
          />
        </div>

        {/* Permissions */}
        {newMember?.role && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissionOptions?.map((permission) => (
                <Checkbox
                  key={permission?.id}
                  label={permission?.label}
                  description={permission?.description}
                  checked={newMember?.permissions?.includes(permission?.id)}
                  onChange={(e) => handlePermissionChange(permission?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleAddMember}
          disabled={!newMember?.email || !newMember?.role}
          iconName="Plus"
          iconPosition="left"
          variant="outline"
        >
          Add Member
        </Button>
      </motion.div>
      {/* Team Members List */}
      {teamMembers?.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Icon name="Users" size={20} />
            <span>Team Members ({teamMembers?.length})</span>
          </h3>

          <AnimatePresence>
            {teamMembers?.map((member) => (
              <motion.div
                key={member?.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 border border-border/50 hover:border-primary/30 transition-all duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={18} color="white" />
                    </div>
                    <div>
                      <p className="font-medium">{member?.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`
                          px-2 py-1 rounded-md text-xs font-medium border
                          ${getRoleColor(member?.role)}
                        `}>
                          {roleOptions?.find(r => r?.value === member?.role)?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member?.permissions?.length} permissions
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveMember(member?.id)}
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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

        <div className="flex space-x-3">
          <Button
            onClick={handleSkip}
            variant="ghost"
          >
            Skip for now
          </Button>
          <Button
            onClick={onNext}
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamSetupStep;