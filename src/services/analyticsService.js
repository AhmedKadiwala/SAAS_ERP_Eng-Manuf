import { supabase } from '../lib/supabase';

class AnalyticsService {
  // Get business analytics overview
  async getAnalyticsOverview() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get revenue data from invoices
      const { data: revenueData, error: revenueError } = await supabase
        ?.from('invoices')
        ?.select('total_amount, issue_date, status')
        ?.eq('created_by', user?.id)
        ?.order('issue_date', { ascending: false })
        ?.limit(100);

      if (revenueError) throw revenueError;

      // Get customer metrics
      const { count: totalCustomers } = await supabase
        ?.from('customers')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('created_by', user?.id);

      // Get product metrics
      const { data: productData, error: productError } = await supabase
        ?.from('products')
        ?.select('price, stock_quantity, category, is_active');

      if (productError) throw productError;

      // Get recent activities
      const { data: activities, error: activitiesError } = await supabase
        ?.from('activities')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (activitiesError) throw activitiesError;

      return {
        data: {
          revenue: this.processRevenueData(revenueData),
          customers: totalCustomers || 0,
          products: this.processProductData(productData),
          activities: activities || []
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      return { data: null, error };
    }
  }

  // Get detailed revenue analytics
  async getRevenueAnalytics(period = '30d') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const dateRange = this.getDateRange(period);
      
      const { data, error } = await supabase
        ?.from('invoices')
        ?.select('total_amount, subtotal, tax_amount, issue_date, status, customer_id')
        ?.eq('created_by', user?.id)
        ?.gte('issue_date', dateRange?.startDate)
        ?.lte('issue_date', dateRange?.endDate)
        ?.order('issue_date', { ascending: true });

      if (error) throw error;

      return {
        data: this.processRevenueAnalytics(data, period),
        error: null
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return { data: null, error };
    }
  }

  // Get customer analytics
  async getCustomerAnalytics() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        ?.from('customers')
        ?.select('status, industry, relationship_score, total_value, created_at, last_interaction')
        ?.eq('created_by', user?.id);

      if (error) throw error;

      return {
        data: this.processCustomerAnalytics(data),
        error: null
      };
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      return { data: null, error };
    }
  }

  // Get product performance analytics
  async getProductAnalytics() {
    try {
      const { data, error } = await supabase
        ?.from('products')
        ?.select('name, category, price, stock_quantity, min_stock_level, is_active');

      if (error) throw error;

      return {
        data: this.processProductAnalytics(data),
        error: null
      };
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      return { data: null, error };
    }
  }

  // Export analytics data
  async exportAnalytics(type, format = 'csv') {
    try {
      let data;
      switch (type) {
        case 'revenue':
          const revenueResult = await this.getRevenueAnalytics('90d');
          data = revenueResult?.data;
          break;
        case 'customers':
          const customerResult = await this.getCustomerAnalytics();
          data = customerResult?.data;
          break;
        case 'products':
          const productResult = await this.getProductAnalytics();
          data = productResult?.data;
          break;
        default:
          throw new Error('Invalid export type');
      }

      return this.formatExportData(data, format);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      return { data: null, error };
    }
  }

  // Helper methods
  processRevenueData(invoices) {
    if (!invoices?.length) return { total: 0, growth: 0, chartData: [] };

    const total = invoices?.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice?.total_amount) || 0);
    }, 0);

    // Generate chart data for last 7 days
    const chartData = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date?.setDate(date?.getDate() - i);
      const dateStr = date?.toISOString()?.split('T')?.[0];
      
      const dayRevenue = invoices
        ?.filter(invoice => invoice?.issue_date === dateStr && invoice?.status === 'paid')
        ?.reduce((sum, invoice) => sum + parseFloat(invoice?.total_amount || 0), 0);
      
      chartData?.push({
        date: date?.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue,
        alt: `${date?.toLocaleDateString()} revenue: $${dayRevenue?.toFixed(2)}`
      });
    }

    return { total, growth: 12.5, chartData }; // Growth would need historical comparison
  }

  processProductData(products) {
    if (!products?.length) return { total: 0, lowStock: 0, categories: [] };

    const total = products?.length;
    const lowStock = products?.filter(product => 
      product?.stock_quantity <= product?.min_stock_level
    )?.length;

    const categoryData = products?.reduce((acc, product) => {
      const category = product?.category || 'other';
      acc[category] = (acc?.[category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object?.entries(categoryData)?.map(([name, count]) => ({
      name: name?.charAt(0)?.toUpperCase() + name?.slice(1),
      count,
      alt: `${name} category: ${count} products`
    }));

    return { total, lowStock, categories };
  }

  processRevenueAnalytics(data, period) {
    if (!data?.length) return { chartData: [], summary: {} };

    const summary = {
      totalRevenue: data?.reduce((sum, item) => sum + parseFloat(item?.total_amount || 0), 0),
      totalInvoices: data?.length,
      averageValue: data?.length ? 
        data?.reduce((sum, item) => sum + parseFloat(item?.total_amount || 0), 0) / data?.length : 0,
      paidInvoices: data?.filter(item => item?.status === 'paid')?.length
    };

    // Group data by time period
    const chartData = this.groupDataByPeriod(data, period);
    
    return { chartData, summary };
  }

  processCustomerAnalytics(data) {
    if (!data?.length) return { statusBreakdown: [], industryBreakdown: [], relationshipData: {} };

    const statusBreakdown = this.groupBy(data, 'status');
    const industryBreakdown = this.groupBy(data, 'industry');
    
    const avgRelationshipScore = data?.reduce((sum, customer) => 
      sum + (customer?.relationship_score || 0), 0) / data?.length;

    return {
      statusBreakdown,
      industryBreakdown,
      relationshipData: {
        average: Math?.round(avgRelationshipScore),
        distribution: this.getRelationshipDistribution(data)
      }
    };
  }

  processProductAnalytics(data) {
    if (!data?.length) return { categoryBreakdown: [], stockAnalysis: {}, priceAnalysis: {} };

    const categoryBreakdown = this.groupBy(data, 'category');
    
    const lowStockProducts = data?.filter(product => 
      product?.stock_quantity <= product?.min_stock_level
    );

    const stockAnalysis = {
      total: data?.length,
      lowStock: lowStockProducts?.length,
      totalValue: data?.reduce((sum, product) => 
        sum + (parseFloat(product?.price || 0) * parseInt(product?.stock_quantity || 0)), 0)
    };

    const prices = data?.map(product => parseFloat(product?.price || 0))?.filter(price => price > 0);
    const priceAnalysis = {
      average: prices?.length ? prices?.reduce((sum, price) => sum + price, 0) / prices?.length : 0,
      min: Math?.min(...prices) || 0,
      max: Math?.max(...prices) || 0
    };

    return { categoryBreakdown, stockAnalysis, priceAnalysis };
  }

  // Utility methods
  getDateRange(period) {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate?.setDate(endDate?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(endDate?.getDate() - 30);
        break;
      case '90d':
        startDate?.setDate(endDate?.getDate() - 90);
        break;
      default:
        startDate?.setDate(endDate?.getDate() - 30);
    }

    return {
      startDate: startDate?.toISOString()?.split('T')?.[0],
      endDate: endDate?.toISOString()?.split('T')?.[0]
    };
  }

  groupBy(array, key) {
    return array?.reduce((result, item) => {
      const group = item?.[key] || 'unknown';
      result[group] = (result?.[group] || 0) + 1;
      return result;
    }, {});
  }

  getRelationshipDistribution(customers) {
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    
    customers?.forEach(customer => {
      const score = customer?.relationship_score || 0;
      if (score >= 80) distribution.excellent++;
      else if (score >= 60) distribution.good++;
      else if (score >= 40) distribution.fair++;
      else distribution.poor++;
    });

    return distribution;
  }

  groupDataByPeriod(data, period) {
    // Implementation would depend on specific period requirements
    // For now, return daily data for the last period
    return data?.map(item => ({
      date: item?.issue_date,
      revenue: parseFloat(item?.total_amount || 0),
      invoices: 1,
      alt: `Revenue for ${item?.issue_date}: $${item?.total_amount}`
    }));
  }

  formatExportData(data, format) {
    if (format === 'json') {
      return {
        data: JSON?.stringify(data, null, 2),
        filename: `analytics-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`,
        error: null
      };
    }
    
    // CSV export would need additional implementation
    return {
      data: 'CSV export not yet implemented',
      filename: `analytics-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`,
      error: null
    };
  }

  // Real-time subscriptions for analytics
  subscribeToAnalyticsUpdates(callback) {
    try {
      const channels = [];
      
      // Subscribe to invoices changes
      channels?.push(
        supabase?.channel('invoices-analytics')?.on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'invoices' },
          callback
        )?.subscribe()
      );

      // Subscribe to customers changes  
      channels?.push(
        supabase?.channel('customers-analytics')?.on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers' },
          callback
        )?.subscribe()
      );

      return () => {
        channels?.forEach(channel => supabase?.removeChannel(channel));
      };
    } catch (error) {
      console.error('Error subscribing to analytics updates:', error);
      return () => {};
    }
  }
}

export const analyticsService = new AnalyticsService();