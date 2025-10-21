import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LeadDetailModal = ({ lead, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(lead || {});

  if (!isOpen || !lead) return null;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'User' },
    { key: 'activity', label: 'Activity', icon: 'Activity' },
    { key: 'notes', label: 'Notes', icon: 'FileText' },
    { key: 'files', label: 'Files', icon: 'Paperclip' }
  ];

  const stageOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleSave = () => {
    onSave(formData);
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-glass border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center space-x-4">
            <Image
              src={lead?.avatar}
              alt={lead?.avatarAlt}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-elevated"
            />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{lead?.name}</h2>
              <p className="text-sm text-muted-foreground">{lead?.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={editMode ? 'default' : 'outline'}
              onClick={() => editMode ? handleSave() : setEditMode(true)}
              iconName={editMode ? 'Save' : 'Edit'}
              iconPosition="left"
            >
              {editMode ? 'Save' : 'Edit'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/50">
          {tabs?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-150
                ${activeTab === tab?.key 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={editMode ? formData?.name : lead?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    disabled={!editMode}
                  />
                  <Input
                    label="Company"
                    value={editMode ? formData?.company : lead?.company}
                    onChange={(e) => handleInputChange('company', e?.target?.value)}
                    disabled={!editMode}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editMode ? formData?.email : lead?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    disabled={!editMode}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={editMode ? formData?.phone : lead?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    disabled={!editMode}
                  />
                </div>
                
                <div className="space-y-4">
                  <Input
                    label="Deal Value"
                    type="number"
                    value={editMode ? formData?.dealValue : lead?.dealValue}
                    onChange={(e) => handleInputChange('dealValue', parseInt(e?.target?.value))}
                    disabled={!editMode}
                  />
                  <Input
                    label="Probability (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={editMode ? formData?.probability : lead?.probability}
                    onChange={(e) => handleInputChange('probability', parseInt(e?.target?.value))}
                    disabled={!editMode}
                  />
                  {editMode ? (
                    <>
                      <Select
                        label="Stage"
                        options={stageOptions}
                        value={formData?.stage}
                        onChange={(value) => handleInputChange('stage', value)}
                      />
                      <Select
                        label="Priority"
                        options={priorityOptions}
                        value={formData?.priority}
                        onChange={(value) => handleInputChange('priority', value)}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        label="Stage"
                        value={lead?.stage}
                        disabled
                      />
                      <Input
                        label="Priority"
                        value={lead?.priority}
                        disabled
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {lead?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {editMode && (
                    <button className="px-3 py-1 border border-dashed border-border rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150">
                      + Add Tag
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Recent Activity</h3>
                <Button variant="outline" size="sm" iconName="Plus">
                  Add Activity
                </Button>
              </div>
              
              <div className="space-y-4">
                {lead?.recentActivities?.map((activity, index) => (
                  <div key={index} className="flex space-x-3 p-4 bg-muted/20 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Activity" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                      <p className="text-xs text-muted-foreground">{activity?.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity?.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Notes</h3>
                <Button variant="outline" size="sm" iconName="Plus">
                  Add Note
                </Button>
              </div>
              
              <div className="space-y-4">
                {lead?.notes?.map((note, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{note?.author}</span>
                      <span className="text-xs text-muted-foreground">{note?.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note?.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Attachments</h3>
                <Button variant="outline" size="sm" iconName="Upload">
                  Upload File
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lead?.files?.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-muted/20 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="File" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{file?.size} • {file?.type}</p>
                    </div>
                    <button className="p-1 hover:bg-muted/50 rounded-md transition-colors duration-150">
                      <Icon name="Download" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border/50">
          <div className="flex items-center space-x-4">
            <Button variant="outline" iconName="Phone" iconPosition="left">
              Call
            </Button>
            <Button variant="outline" iconName="Mail" iconPosition="left">
              Email
            </Button>
            <Button variant="outline" iconName="Calendar" iconPosition="left">
              Schedule
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="default" iconName="FileText" iconPosition="left">
              Create Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;