import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import PipelineStage from './components/PipelineStage';

import PipelineFilters from './components/PipelineFilters';
import PipelineMetrics from './components/PipelineMetrics';
import ActivityTimeline from './components/ActivityTimeline';
import LeadDetailModal from './components/LeadDetailModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LeadPipelineManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showActivityTimeline, setShowActivityTimeline] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [filters, setFilters] = useState({});

  // Mock data for pipeline stages
  const [pipelineStages] = useState([
  { id: 'prospect', name: 'Prospect', color: 'gray' },
  { id: 'qualified', name: 'Qualified', color: 'blue' },
  { id: 'proposal', name: 'Proposal', color: 'yellow' },
  { id: 'negotiation', name: 'Negotiation', color: 'orange' },
  { id: 'closed-won', name: 'Closed Won', color: 'green' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'red' }]
  );

  // Mock leads data
  const [leads, setLeads] = useState({
    'prospect': [
    {
      id: 'lead-1',
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      email: 'sarah@techstart.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      dealValue: 25000,
      probability: 30,
      priority: 'High',
      score: 4,
      avatar: "https://images.unsplash.com/photo-1734991032476-bceab8383a59",
      avatarAlt: 'Professional headshot of woman with shoulder-length brown hair in business attire',
      lastActivity: 'Sent proposal document',
      lastActivityDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['Enterprise', 'Hot Lead'],
      source: 'website',
      assignee: 'john-doe',
      stage: 'prospect',
      recentActivities: [
      {
        title: 'Email Sent',
        description: 'Sent follow-up email with pricing information',
        timestamp: '2 hours ago'
      }],

      notes: [
      {
        author: 'John Doe',
        content: 'Very interested in our enterprise package. Mentioned budget of $25K.',
        timestamp: '3 hours ago'
      }],

      files: [
      {
        name: 'Proposal_TechStart.pdf',
        size: '2.4 MB',
        type: 'PDF'
      }]

    },
    {
      id: 'lead-2',
      name: 'Michael Chen',
      company: 'Digital Solutions LLC',
      email: 'michael@digitalsolutions.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      dealValue: 15000,
      probability: 25,
      priority: 'Medium',
      score: 3,
      avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
      avatarAlt: 'Professional headshot of Asian man with short black hair in navy suit',
      lastActivity: 'Scheduled demo call',
      lastActivityDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tags: ['SMB', 'Demo Scheduled'],
      source: 'referral',
      assignee: 'jane-smith',
      stage: 'prospect'
    }],

    'qualified': [
    {
      id: 'lead-3',
      name: 'Emily Rodriguez',
      company: 'Growth Marketing Co.',
      email: 'emily@growthmarketing.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      dealValue: 35000,
      probability: 65,
      priority: 'High',
      score: 5,
      avatar: "https://images.unsplash.com/photo-1719515862094-c6e9354ee7f8",
      avatarAlt: 'Professional headshot of Hispanic woman with long dark hair in white blouse',
      lastActivity: 'Completed product demo',
      lastActivityDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      tags: ['Enterprise', 'Decision Maker'],
      source: 'social',
      assignee: 'mike-johnson',
      stage: 'qualified'
    }],

    'proposal': [
    {
      id: 'lead-4',
      name: 'David Thompson',
      company: 'Innovation Labs',
      email: 'david@innovationlabs.com',
      phone: '+1 (555) 321-0987',
      location: 'Seattle, WA',
      dealValue: 50000,
      probability: 80,
      priority: 'High',
      score: 5,
      avatar: "https://images.unsplash.com/photo-1585066047759-3438c34cf676",
      avatarAlt: 'Professional headshot of Caucasian man with beard in dark suit',
      lastActivity: 'Reviewed contract terms',
      lastActivityDate: new Date(Date.now() - 30 * 60 * 1000),
      tags: ['Enterprise', 'Contract Review'],
      source: 'trade-show',
      assignee: 'sarah-wilson',
      stage: 'proposal'
    }],

    'negotiation': [
    {
      id: 'lead-5',
      name: 'Lisa Wang',
      company: 'Future Systems Inc.',
      email: 'lisa@futuresystems.com',
      phone: '+1 (555) 654-3210',
      location: 'Los Angeles, CA',
      dealValue: 75000,
      probability: 90,
      priority: 'High',
      score: 5,
      avatar: "https://images.unsplash.com/photo-1597621969117-1a305d3e0c68",
      avatarAlt: 'Professional headshot of Asian woman with short black hair in gray blazer',
      lastActivity: 'Negotiating final terms',
      lastActivityDate: new Date(Date.now() - 15 * 60 * 1000),
      tags: ['Enterprise', 'Final Stage'],
      source: 'email',
      assignee: 'john-doe',
      stage: 'negotiation'
    }],

    'closed-won': [
    {
      id: 'lead-6',
      name: 'Robert Miller',
      company: 'Success Ventures',
      email: 'robert@successventures.com',
      phone: '+1 (555) 789-0123',
      location: 'Chicago, IL',
      dealValue: 40000,
      probability: 100,
      priority: 'High',
      score: 5,
      avatar: "https://images.unsplash.com/photo-1718392372853-fa38c8ff37c8",
      avatarAlt: 'Professional headshot of middle-aged Caucasian man with gray hair in blue shirt',
      lastActivity: 'Contract signed',
      lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['Closed Won', 'Success Story'],
      source: 'cold-call',
      assignee: 'jane-smith',
      stage: 'closed-won'
    }],

    'closed-lost': []
  });

  // Mock pipeline metrics
  const pipelineMetrics = {
    totalValue: 240000,
    valueChange: 12.5,
    conversionRate: 24,
    conversionChange: 3.2,
    avgDealSize: 40000,
    dealSizeChange: -2.1,
    salesVelocity: 45,
    velocityChange: -5.8
  };

  // Mock activity timeline data
  const activityTimeline = [
  {
    id: 'activity-1',
    type: 'call',
    title: 'Call with Sarah Johnson',
    description: 'Discussed pricing and implementation timeline',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: {
      avatar: "https://images.unsplash.com/photo-1506017744066-d9d6150e74a4",
      avatarAlt: 'Professional headshot of sales representative John Doe'
    },
    lead: 'Sarah Johnson',
    duration: '25 min',
    outcome: 'positive',
    details: 'Client showed strong interest in enterprise features. Requested detailed proposal by end of week.'
  },
  {
    id: 'activity-2',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Sent comprehensive proposal to Emily Rodriguez',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: {
      avatar: "https://images.unsplash.com/photo-1587403655231-b1734312903f",
      avatarAlt: 'Professional headshot of sales representative Jane Smith'
    },
    lead: 'Emily Rodriguez',
    outcome: 'neutral'
  },
  {
    id: 'activity-3',
    type: 'meeting',
    title: 'Demo Presentation',
    description: 'Product demonstration for Innovation Labs team',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: {
      avatar: "https://images.unsplash.com/photo-1564898034208-360248087b0e",
      avatarAlt: 'Professional headshot of sales representative Mike Johnson'
    },
    lead: 'David Thompson',
    duration: '45 min',
    outcome: 'positive'
  },
  {
    id: 'activity-4',
    type: 'stage_change',
    title: 'Stage Updated',
    description: 'Lisa Wang moved to Negotiation stage',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lead: 'Lisa Wang'
  }];


  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
    destination?.droppableId === source?.droppableId &&
    destination?.index === source?.index)
    {
      return;
    }

    const sourceStage = source?.droppableId;
    const destStage = destination?.droppableId;

    const newLeads = { ...leads };
    const [movedLead] = newLeads?.[sourceStage]?.splice(source?.index, 1);
    movedLead.stage = destStage;
    newLeads?.[destStage]?.splice(destination?.index, 0, movedLead);

    setLeads(newLeads);

    // Show success notification
    console.log(`Lead ${movedLead?.name} moved to ${destStage}`);
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowLeadModal(true);
  };

  const handleQuickAction = (action, lead) => {
    console.log(`${action} action for lead:`, lead?.name);

    switch (action) {
      case 'call':
        // Implement call functionality
        break;
      case 'email':
        // Implement email functionality
        break;
      case 'schedule':
        // Implement scheduling functionality
        break;
      default:
        break;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to leads data
    console.log('Filters applied:', newFilters);
  };

  const handleBulkAction = (action, selectedLeads) => {
    console.log(`Bulk ${action} for leads:`, selectedLeads);
    // Implement bulk actions
  };

  const handleLeadSave = (updatedLead) => {
    // Update lead in the leads state
    const newLeads = { ...leads };
    Object.keys(newLeads)?.forEach((stageId) => {
      const leadIndex = newLeads?.[stageId]?.findIndex((lead) => lead?.id === updatedLead?.id);
      if (leadIndex !== -1) {
        newLeads[stageId][leadIndex] = updatedLead;
      }
    });
    setLeads(newLeads);
    setShowLeadModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
        <NavigationHeader sidebarCollapsed={sidebarCollapsed} />
        
        <main className="pt-16 p-6">
          <div className="max-w-full mx-auto">
            <NavigationBreadcrumbs />
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Lead Pipeline Management</h1>
                <p className="text-muted-foreground">
                  Track and manage your sales pipeline with visual drag-and-drop functionality
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowActivityTimeline(!showActivityTimeline)}
                  iconName="Activity"
                  iconPosition="left">

                  Activity Timeline
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/sales-analytics-suite')}
                  iconName="BarChart3"
                  iconPosition="left">

                  Analytics
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/customer-directory')}
                  iconName="Plus"
                  iconPosition="left">

                  Add Lead
                </Button>
              </div>
            </div>

            {/* Pipeline Metrics */}
            <PipelineMetrics metrics={pipelineMetrics} />

            {/* Filters */}
            <PipelineFilters
              onFilterChange={handleFilterChange}
              onBulkAction={handleBulkAction}
              selectedLeads={selectedLeads} />


            {/* Pipeline Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="overflow-x-auto pb-6">
                <div className="flex space-x-6 min-w-max">
                  {pipelineStages?.map((stage) =>
                  <div key={stage?.id} className="w-80 flex-shrink-0">
                      <PipelineStage
                      stage={stage}
                      leads={leads?.[stage?.id] || []}
                      onLeadClick={handleLeadClick}
                      onQuickAction={handleQuickAction} />

                    </div>
                  )}
                </div>
              </div>
            </DragDropContext>

            {/* Pipeline Flow Visualization */}
            <div className="mt-8 glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pipeline Flow</h3>
              <div className="flex items-center justify-between">
                {pipelineStages?.map((stage, index) =>
                <React.Fragment key={stage?.id}>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <span className="text-sm font-bold text-primary">
                          {leads?.[stage?.id]?.length || 0}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground text-center">{stage?.name}</span>
                    </div>
                    {index < pipelineStages?.length - 1 &&
                  <div className="flex-1 h-px bg-border mx-4 relative">
                        <Icon
                      name="ArrowRight"
                      size={16}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background text-muted-foreground" />

                      </div>
                  }
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Activity Timeline Sidebar */}
      <ActivityTimeline
        activities={activityTimeline}
        isVisible={showActivityTimeline}
        onClose={() => setShowActivityTimeline(false)} />

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSave={handleLeadSave} />

      <QuickActionButton />
    </div>);

};

export default LeadPipelineManagement;