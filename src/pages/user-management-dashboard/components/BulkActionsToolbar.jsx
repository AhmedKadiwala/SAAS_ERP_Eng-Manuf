import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsToolbar = ({ selectedUsers, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionOptions = [
    { value: '', label: 'Select action...', disabled: true },
    { value: 'activate', label: 'Activate Users' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'change_role', label: 'Change Role' },
    { value: 'export', label: 'Export Data' },
    { value: 'delete', label: 'Delete Users' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'sales', label: 'Sales Representative' },
    { value: 'support', label: 'Support Agent' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const handleExecuteAction = async () => {
    if (!selectedAction || selectedUsers?.length === 0) return;

    setIsLoading(true);
    try {
      await onBulkAction(selectedAction, selectedUsers);
      setSelectedAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      activate: 'UserCheck',
      deactivate: 'UserX',
      change_role: 'UserCog',
      export: 'Download',
      delete: 'Trash2'
    };
    return icons?.[action] || 'Settings';
  };

  const getActionVariant = (action) => {
    if (action === 'delete') return 'destructive';
    if (action === 'activate') return 'success';
    return 'default';
  };

  if (selectedUsers?.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={16} className="text-primary" />
            </div>
            <span className="font-medium text-foreground">
              {selectedUsers?.length} user{selectedUsers?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center space-x-3">
            <Select
              options={actionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Select action..."
              className="min-w-48"
            />

            {selectedAction === 'change_role' && (
              <Select
                options={roleOptions}
                placeholder="Select new role..."
                className="min-w-40"
              />
            )}

            <Button
              onClick={handleExecuteAction}
              disabled={!selectedAction || isLoading}
              loading={isLoading}
              variant={getActionVariant(selectedAction)}
              iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
              iconPosition="left"
            >
              Execute
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>
      </div>
      {/* Action Preview */}
      {selectedAction && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Action Preview
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedAction === 'activate' && `Activate ${selectedUsers?.length} user accounts`}
                {selectedAction === 'deactivate' && `Deactivate ${selectedUsers?.length} user accounts`}
                {selectedAction === 'change_role' && `Change role for ${selectedUsers?.length} users`}
                {selectedAction === 'export' && `Export data for ${selectedUsers?.length} users`}
                {selectedAction === 'delete' && `Permanently delete ${selectedUsers?.length} user accounts`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsToolbar;