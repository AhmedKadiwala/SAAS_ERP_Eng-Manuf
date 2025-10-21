import { supabase } from '../lib/supabase';

export const paymentService = {
  // Payment Methods
  async getPaymentMethods(customerId = null) {
    try {
      let query = supabase?.from('payment_methods')?.select(`
          *,
          customer:customers(id, company_name, contact_person)
        `)?.eq('is_active', true)?.order('is_default', { ascending: false })?.order('created_at', { ascending: false });

      if (customerId) {
        query = query?.eq('customer_id', customerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch payment methods: ${error?.message || 'Unknown error'}`);
    }
  },

  async createPaymentMethod(methodData) {
    try {
      const { data, error } = await supabase?.from('payment_methods')?.insert([{
          ...methodData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create payment method: ${error?.message || 'Unknown error'}`);
    }
  },

  async updatePaymentMethod(id, updates) {
    try {
      const { data, error } = await supabase?.from('payment_methods')?.update(updates)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update payment method: ${error?.message || 'Unknown error'}`);
    }
  },

  async deletePaymentMethod(id) {
    try {
      const { error } = await supabase?.from('payment_methods')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete payment method: ${error?.message || 'Unknown error'}`);
    }
  },

  // Payment Transactions
  async getPaymentTransactions(filters = {}) {
    try {
      let query = supabase?.from('payment_transactions')?.select(`
          *,
          invoice:invoices(id, invoice_number, total_amount),
          customer:customers(id, company_name, contact_person),
          payment_method:payment_methods(id, method_name, method_type)
        `)?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.customerId) {
        query = query?.eq('customer_id', filters?.customerId);
      }
      if (filters?.dateFrom) {
        query = query?.gte('payment_date', filters?.dateFrom);
      }
      if (filters?.dateTo) {
        query = query?.lte('payment_date', filters?.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch payment transactions: ${error?.message || 'Unknown error'}`);
    }
  },

  async createPaymentTransaction(transactionData) {
    try {
      const { data, error } = await supabase?.from('payment_transactions')?.insert([{
          ...transactionData,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id,
          transaction_reference: transactionData?.transaction_reference || `TXN-${Date.now()}`
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create payment transaction: ${error?.message || 'Unknown error'}`);
    }
  },

  async updatePaymentStatus(transactionId, status, paymentDate = null) {
    try {
      const updates = { 
        status,
        ...(paymentDate && { payment_date: paymentDate })
      };

      const { data, error } = await supabase?.from('payment_transactions')?.update(updates)?.eq('id', transactionId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error?.message || 'Unknown error'}`);
    }
  },

  async processRefund(transactionId, refundAmount, notes = '') {
    try {
      const { data: originalTransaction, error: fetchError } = await supabase?.from('payment_transactions')?.select('*')?.eq('id', transactionId)?.single();

      if (fetchError) throw fetchError;

      // Create refund transaction
      const { data, error } = await supabase?.from('payment_transactions')?.insert([{
          invoice_id: originalTransaction?.invoice_id,
          payment_method_id: originalTransaction?.payment_method_id,
          customer_id: originalTransaction?.customer_id,
          user_id: (await supabase?.auth?.getUser())?.data?.user?.id,
          transaction_reference: `REF-${Date.now()}`,
          amount: -Math.abs(refundAmount),
          currency_code: originalTransaction?.currency_code,
          status: 'completed',
          payment_date: new Date()?.toISOString(),
          notes: `Refund for transaction ${originalTransaction?.transaction_reference}. ${notes}`
        }])?.select()?.single();

      if (error) throw error;

      // Update original transaction status
      await this.updatePaymentStatus(transactionId, 'refunded');

      return data;
    } catch (error) {
      throw new Error(`Failed to process refund: ${error?.message || 'Unknown error'}`);
    }
  },

  // Payment Analytics
  async getPaymentAnalytics(dateFrom, dateTo) {
    try {
      const { data, error } = await supabase?.from('payment_transactions')?.select(`
          status,
          amount,
          currency_code,
          payment_date,
          payment_method:payment_methods(method_type)
        `)?.gte('created_at', dateFrom)?.lte('created_at', dateTo);

      if (error) throw error;

      const analytics = {
        totalRevenue: 0,
        totalTransactions: data?.length || 0,
        statusBreakdown: {},
        methodBreakdown: {},
        dailyRevenue: {}
      };

      data?.forEach(transaction => {
        // Total revenue (only completed payments)
        if (transaction?.status === 'completed' && transaction?.amount > 0) {
          analytics.totalRevenue += parseFloat(transaction?.amount);
        }

        // Status breakdown
        analytics.statusBreakdown[transaction?.status] = 
          (analytics?.statusBreakdown?.[transaction?.status] || 0) + 1;

        // Payment method breakdown
        const methodType = transaction?.payment_method?.method_type || 'unknown';
        analytics.methodBreakdown[methodType] = 
          (analytics?.methodBreakdown?.[methodType] || 0) + 1;

        // Daily revenue
        if (transaction?.payment_date) {
          const date = new Date(transaction.payment_date)?.toISOString()?.split('T')?.[0];
          analytics.dailyRevenue[date] = 
            (analytics?.dailyRevenue?.[date] || 0) + parseFloat(transaction?.amount);
        }
      });

      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch payment analytics: ${error?.message || 'Unknown error'}`);
    }
  },

  // Overdue Payments
  async getOverduePayments() {
    try {
      const { data, error } = await supabase?.from('payment_transactions')?.select(`
          *,
          invoice:invoices(id, invoice_number, due_date),
          customer:customers(id, company_name, contact_person, email)
        `)?.eq('status', 'pending')?.lt('due_date', new Date()?.toISOString())?.order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch overdue payments: ${error?.message || 'Unknown error'}`);
    }
  },

  // Real-time subscriptions
  subscribeToPaymentTransactions(callback) {
    return supabase?.channel('payment_transactions')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_transactions' },
        callback
      )?.subscribe();
  }
};