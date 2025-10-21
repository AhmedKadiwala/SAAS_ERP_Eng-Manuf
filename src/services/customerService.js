import { supabase } from '../lib/supabase';

class CustomerService {
  // Get all customers with optional filtering
  async getCustomers(filters = {}) {
    try {
      let query = supabase?.from('customers')?.select(`
          *,
          created_by_profile:user_profiles!customers_created_by_fkey(
            id,
            full_name,
            email
          )
        `)?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.industry && filters?.industry !== 'all') {
        query = query?.eq('industry', filters?.industry);
      }

      if (filters?.relationship && filters?.relationship !== 'all') {
        const scoreRange = this.getRelationshipScoreRange(filters?.relationship);
        if (scoreRange) {
          query = query?.gte('relationship_score', scoreRange?.min)?.lte('relationship_score', scoreRange?.max);
        }
      }

      if (filters?.search) {
        query = query?.or(`company_name.ilike.%${filters?.search}%,contact_person.ilike.%${filters?.search}%,email.ilike.%${filters?.search}%`);
      }

      if (filters?.tags && filters?.tags?.length > 0) {
        query = query?.overlaps('tags', filters?.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return { data: null, error };
    }
  }

  // Get customer by ID
  async getCustomerById(id) {
    try {
      const { data, error } = await supabase?.from('customers')?.select(`
          *,
          created_by_profile:user_profiles!customers_created_by_fkey(
            id,
            full_name,
            email
          ),
          projects(
            id,
            name,
            status,
            progress_percentage
          ),
          leads(
            id,
            title,
            status,
            value
          )
        `)?.eq('id', id)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return { data: null, error };
    }
  }

  // Create new customer
  async createCustomer(customerData) {
    try {
      // Get current user
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const newCustomer = {
        ...customerData,
        created_by: user?.id,
        last_interaction: new Date()?.toISOString()
      };

      const { data, error } = await supabase?.from('customers')?.insert([newCustomer])?.select()?.single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        title: 'Customer Created',
        description: `Created new customer: ${data?.company_name}`,
        activity_type: 'customer_created',
        related_type: 'customer',
        related_id: data?.id,
        user_id: user?.id
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { data: null, error };
    }
  }

  // Update customer
  async updateCustomer(id, updateData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await // Ensure user can only update their own customers
      supabase?.from('customers')?.update({
          ...updateData,
          updated_at: new Date()?.toISOString()
        })?.eq('id', id)?.eq('created_by', user?.id)?.select()?.single();

      if (error) throw error;

      // Log activity
      await this.logActivity({
        title: 'Customer Updated',
        description: `Updated customer: ${data?.company_name}`,
        activity_type: 'customer_updated',
        related_type: 'customer',
        related_id: data?.id,
        user_id: user?.id
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating customer:', error);
      return { data: null, error };
    }
  }

  // Delete customer
  async deleteCustomer(id) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get customer details before deletion for logging
      const { data: customer } = await supabase?.from('customers')?.select('company_name')?.eq('id', id)?.eq('created_by', user?.id)?.single();

      const { error } = await supabase?.from('customers')?.delete()?.eq('id', id)?.eq('created_by', user?.id);

      if (error) throw error;

      // Log activity
      if (customer) {
        await this.logActivity({
          title: 'Customer Deleted',
          description: `Deleted customer: ${customer?.company_name}`,
          activity_type: 'customer_deleted',
          related_type: 'customer',
          related_id: id,
          user_id: user?.id
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { error };
    }
  }

  // Bulk operations
  async bulkUpdateCustomers(customerIds, updateData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.from('customers')?.update(updateData)?.in('id', customerIds)?.eq('created_by', user?.id)?.select();

      if (error) throw error;

      // Log bulk activity
      await this.logActivity({
        title: 'Bulk Customer Update',
        description: `Updated ${customerIds?.length} customers`,
        activity_type: 'bulk_update',
        related_type: 'customer',
        user_id: user?.id,
        metadata: { customer_ids: customerIds, update_data: updateData }
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error bulk updating customers:', error);
      return { data: null, error };
    }
  }

  async bulkDeleteCustomers(customerIds) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase?.from('customers')?.delete()?.in('id', customerIds)?.eq('created_by', user?.id);

      if (error) throw error;

      // Log bulk activity
      await this.logActivity({
        title: 'Bulk Customer Deletion',
        description: `Deleted ${customerIds?.length} customers`,
        activity_type: 'bulk_delete',
        related_type: 'customer',
        user_id: user?.id,
        metadata: { customer_ids: customerIds }
      });

      return { error: null };
    } catch (error) {
      console.error('Error bulk deleting customers:', error);
      return { error };
    }
  }

  // Get customer statistics
  async getCustomerStats() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get total customers
      const { count: totalCustomers } = await supabase?.from('customers')?.select('*', { count: 'exact', head: true })?.eq('created_by', user?.id);

      // Get active customers
      const { count: activeCustomers } = await supabase?.from('customers')?.select('*', { count: 'exact', head: true })?.eq('created_by', user?.id)?.eq('status', 'active');

      // Get new customers this month
      const startOfMonth = new Date();
      startOfMonth?.setDate(1);
      startOfMonth?.setHours(0, 0, 0, 0);

      const { count: newThisMonth } = await supabase?.from('customers')?.select('*', { count: 'exact', head: true })?.eq('created_by', user?.id)?.gte('created_at', startOfMonth?.toISOString());

      // Calculate average relationship score
      const { data: scoreData } = await supabase?.from('customers')?.select('relationship_score')?.eq('created_by', user?.id)?.not('relationship_score', 'is', null);

      const avgScore = scoreData?.length > 0 
        ? Math.round(scoreData?.reduce((sum, customer) => sum + customer?.relationship_score, 0) / scoreData?.length)
        : 0;

      return {
        data: {
          totalCustomers: totalCustomers || 0,
          customerGrowth: 12.5, // Would need historical data for real calculation
          activeCustomers: activeCustomers || 0,
          activeGrowth: 8.3, // Would need historical data for real calculation
          newThisMonth: newThisMonth || 0,
          newGrowth: 23.1, // Would need historical data for real calculation
          avgRelationshipScore: avgScore,
          relationshipChange: 4.2 // Would need historical data for real calculation
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return { data: null, error };
    }
  }

  // Update last interaction
  async updateLastInteraction(customerId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.from('customers')?.update({ 
          last_interaction: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('id', customerId)?.eq('created_by', user?.id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating last interaction:', error);
      return { data: null, error };
    }
  }

  // Helper methods
  getRelationshipScoreRange(level) {
    switch (level) {
      case 'excellent':
        return { min: 80, max: 100 };
      case 'good':
        return { min: 60, max: 79 };
      case 'fair':
        return { min: 40, max: 59 };
      case 'poor':
        return { min: 0, max: 39 };
      default:
        return null;
    }
  }

  // Log activity helper
  async logActivity(activityData) {
    try {
      await supabase?.from('activities')?.insert([activityData]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Real-time subscription for customers
  subscribeToCustomers(callback) {
    try {
      const channel = supabase?.channel('customers')?.on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'customers'
          },
          callback
        )?.subscribe();

      return () => supabase?.removeChannel(channel);
    } catch (error) {
      console.error('Error subscribing to customers:', error);
      return () => {};
    }
  }
}

export const customerService = new CustomerService();