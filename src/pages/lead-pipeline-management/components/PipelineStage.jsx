import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import LeadCard from './LeadCard';
import Icon from '../../../components/AppIcon';

const PipelineStage = ({ stage, leads, onLeadClick, onQuickAction }) => {
  const getStageColor = (stageName) => {
    const colors = {
      'Prospect': 'bg-gradient-to-br from-gray-500 to-gray-600',
      'Qualified': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'Proposal': 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'Negotiation': 'bg-gradient-to-br from-orange-500 to-orange-600',
      'Closed Won': 'bg-gradient-to-br from-green-500 to-green-600',
      'Closed Lost': 'bg-gradient-to-br from-red-500 to-red-600'
    };
    return colors?.[stageName] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  const getStageIcon = (stageName) => {
    const icons = {
      'Prospect': 'Eye',
      'Qualified': 'CheckCircle',
      'Proposal': 'FileText',
      'Negotiation': 'Handshake',
      'Closed Won': 'Trophy',
      'Closed Lost': 'XCircle'
    };
    return icons?.[stageName] || 'Circle';
  };

  const totalValue = leads?.reduce((sum, lead) => sum + lead?.dealValue, 0);
  const avgProbability = leads?.length > 0 
    ? Math.round(leads?.reduce((sum, lead) => sum + lead?.probability, 0) / leads?.length)
    : 0;

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-glass rounded-xl border border-border/50 shadow-glass">
      {/* Stage Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${getStageColor(stage?.name)} flex items-center justify-center shadow-elevated`}>
              <Icon name={getStageIcon(stage?.name)} size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{stage?.name}</h3>
              <p className="text-sm text-muted-foreground">{leads?.length} leads</p>
            </div>
          </div>
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>

        {/* Stage Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Value</p>
            <p className="font-semibold text-sm">${totalValue?.toLocaleString()}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg. Probability</p>
            <p className="font-semibold text-sm">{avgProbability}%</p>
          </div>
        </div>
      </div>
      {/* Droppable Area */}
      <Droppable droppableId={stage?.id}>
        {(provided, snapshot) => (
          <div
            ref={provided?.innerRef}
            {...provided?.droppableProps}
            className={`flex-1 p-4 space-y-3 overflow-y-auto min-h-96 transition-colors duration-150 ${
              snapshot?.isDraggingOver ? 'bg-primary/5' : ''
            }`}
          >
            {leads?.map((lead, index) => (
              <LeadCard
                key={lead?.id}
                lead={lead}
                index={index}
                onClick={() => onLeadClick(lead)}
                onQuickAction={onQuickAction}
              />
            ))}
            {provided?.placeholder}
            
            {/* Empty State */}
            {leads?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Plus" size={24} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No leads in this stage</p>
                <button className="text-xs text-primary hover:text-primary/80 transition-colors duration-150">
                  Add lead
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default PipelineStage;