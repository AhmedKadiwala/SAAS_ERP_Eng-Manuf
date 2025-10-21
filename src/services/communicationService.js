import { supabase } from '../lib/supabase';

export const communicationService = {
  // Templates Management
  async getTemplates(type = null) {
    try {
      let query = supabase?.from('communication_templates')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: false });

      if (type) {
        query = query?.eq('template_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch templates: ${error?.message || 'Unknown error'}`);
    }
  },

  async createTemplate(templateData) {
    try {
      const { data, error } = await supabase?.from('communication_templates')?.insert([{
          ...templateData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create template: ${error?.message || 'Unknown error'}`);
    }
  },

  async updateTemplate(id, updates) {
    try {
      const { data, error } = await supabase?.from('communication_templates')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update template: ${error?.message || 'Unknown error'}`);
    }
  },

  async deleteTemplate(id) {
    try {
      const { error } = await supabase?.from('communication_templates')?.update({ is_active: false })?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete template: ${error?.message || 'Unknown error'}`);
    }
  },

  // Campaign Management
  async getCampaigns(status = null) {
    try {
      let query = supabase?.from('communication_campaigns')?.select(`
          *,
          template:communication_templates(id, template_name, template_type)
        `)?.order('created_at', { ascending: false });

      if (status) {
        query = query?.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error?.message || 'Unknown error'}`);
    }
  },

  async createCampaign(campaignData) {
    try {
      const { data, error } = await supabase?.from('communication_campaigns')?.insert([{
          ...campaignData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error?.message || 'Unknown error'}`);
    }
  },

  async updateCampaign(id, updates) {
    try {
      const { data, error } = await supabase?.from('communication_campaigns')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update campaign: ${error?.message || 'Unknown error'}`);
    }
  },

  // Communication Logs
  async getCommunicationLogs(customerId = null, limit = 50) {
    try {
      let query = supabase?.from('communication_logs')?.select(`
          *,
          customer:customers(id, company_name, contact_person),
          campaign:communication_campaigns(id, campaign_name),
          template:communication_templates(id, template_name)
        `)?.order('sent_at', { ascending: false })?.limit(limit);

      if (customerId) {
        query = query?.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch communication logs: ${error?.message || 'Unknown error'}`);
    }
  },

  async createCommunicationLog(logData) {
    try {
      const { data, error } = await supabase?.from('communication_logs')?.insert([{
          ...logData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create communication log: ${error?.message || 'Unknown error'}`);
    }
  },

  async updateCommunicationStatus(logId, status, eventData = {}) {
    try {
      const updates = {
        status,
        ...(status === 'delivered' && { delivered_at: new Date()?.toISOString() }),
        ...(status === 'opened' && { opened_at: new Date()?.toISOString() }),
        ...(status === 'clicked' && { clicked_at: new Date()?.toISOString() }),
        ...(Object.keys(eventData)?.length > 0 && { response_data: eventData })
      };

      const { data, error } = await supabase?.from('communication_logs')?.update(updates)?.eq('id', logId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update communication status: ${error?.message || 'Unknown error'}`);
    }
  },

  // Follow-up Tasks
  async getFollowUpTasks(filters = {}) {
    try {
      let query = supabase?.from('follow_up_tasks')?.select(`
          *,
          customer:customers(id, company_name, contact_person),
          assigned_user:user_profiles!follow_up_tasks_assigned_to_fkey(id, full_name, email),
          created_user:user_profiles!follow_up_tasks_created_by_fkey(id, full_name, email),
          related_communication:communication_logs(id, subject, channel)
        `)?.order('due_date', { ascending: true });

      if (filters?.isCompleted !== undefined) {
        query = query?.eq('is_completed', filters?.isCompleted);
      }
      if (filters?.assignedTo) {
        query = query?.eq('assigned_to', filters?.assignedTo);
      }
      if (filters?.customerId) {
        query = query?.eq('customer_id', filters?.customerId);
      }
      if (filters?.priority) {
        query = query?.eq('priority', filters?.priority);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch follow-up tasks: ${error?.message || 'Unknown error'}`);
    }
  },

  async createFollowUpTask(taskData) {
    try {
      const { data, error } = await supabase?.from('follow_up_tasks')?.insert([{
          ...taskData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create follow-up task: ${error?.message || 'Unknown error'}`);
    }
  },

  async updateFollowUpTask(id, updates) {
    try {
      // If marking as completed, set completed_at timestamp
      if (updates?.is_completed === true && !updates?.completed_at) {
        updates.completed_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('follow_up_tasks')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update follow-up task: ${error?.message || 'Unknown error'}`);
    }
  },

  async deleteFollowUpTask(id) {
    try {
      const { error } = await supabase?.from('follow_up_tasks')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete follow-up task: ${error?.message || 'Unknown error'}`);
    }
  },

  // Template Processing
  processTemplate(template, variables) {
    try {
      let { content, subject } = template;

      // Replace variables in both content and subject
      Object.keys(variables)?.forEach(key => {
        const placeholder = `{${key}}`;
        const value = variables?.[key] || '';
        content = content?.replace(new RegExp(placeholder, 'g'), value);
        if (subject) {
          subject = subject?.replace(new RegExp(placeholder, 'g'), value);
        }
      });

      return { content, subject };
    } catch (error) {
      throw new Error(`Failed to process template: ${error?.message || 'Unknown error'}`);
    }
  },

  // Communication Analytics
  async getCommunicationAnalytics(dateFrom, dateTo) {
    try {
      const { data, error } = await supabase?.from('communication_logs')?.select(`
          channel,
          status,
          sent_at,
          delivered_at,
          opened_at,
          clicked_at
        `)?.gte('sent_at', dateFrom)?.lte('sent_at', dateTo);

      if (error) throw error;

      const analytics = {
        totalSent: data?.length || 0,
        channelBreakdown: {},
        statusBreakdown: {},
        engagementRates: {
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0
        },
        dailyActivity: {}
      };

      let deliveredCount = 0;
      let openedCount = 0;
      let clickedCount = 0;

      data?.forEach(log => {
        // Channel breakdown
        analytics.channelBreakdown[log?.channel] = 
          (analytics?.channelBreakdown?.[log?.channel] || 0) + 1;

        // Status breakdown
        analytics.statusBreakdown[log?.status] = 
          (analytics?.statusBreakdown?.[log?.status] || 0) + 1;

        // Engagement tracking
        if (log?.delivered_at) deliveredCount++;
        if (log?.opened_at) openedCount++;
        if (log?.clicked_at) clickedCount++;

        // Daily activity
        const date = new Date(log.sent_at)?.toISOString()?.split('T')?.[0];
        analytics.dailyActivity[date] = 
          (analytics?.dailyActivity?.[date] || 0) + 1;
      });

      // Calculate engagement rates
      if (analytics?.totalSent > 0) {
        analytics.engagementRates.deliveryRate = (deliveredCount / analytics?.totalSent) * 100;
        analytics.engagementRates.openRate = (openedCount / analytics?.totalSent) * 100;
        analytics.engagementRates.clickRate = (clickedCount / analytics?.totalSent) * 100;
      }

      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch communication analytics: ${error?.message || 'Unknown error'}`);
    }
  },

  // Real-time subscriptions
  subscribeToCommunicationLogs(callback) {
    return supabase?.channel('communication_logs')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'communication_logs' },
        callback
      )?.subscribe();
  },

  subscribeToFollowUpTasks(callback) {
    return supabase?.channel('follow_up_tasks')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'follow_up_tasks' },
        callback
      )?.subscribe();
  }
};