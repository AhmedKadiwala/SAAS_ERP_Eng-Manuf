import { supabase } from '../lib/supabase';

class InventoryService {
  // Get all products with stock information
  async getInventoryOverview(filters = {}) {
    try {
      let query = supabase?.from('products')?.select('*')?.order('updated_at', { ascending: false });

      // Apply filters
      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.stockStatus) {
        switch (filters?.stockStatus) {
          case 'low':
            query = query?.filter('stock_quantity', 'lte', supabase?.raw('min_stock_level'));
            break;
          case 'out':
            query = query?.eq('stock_quantity', 0);
            break;
          case 'normal':
            query = query?.filter('stock_quantity', 'gt', supabase?.raw('min_stock_level'));
            break;
        }
      }

      if (filters?.active !== undefined) {
        query = query?.eq('is_active', filters?.active);
      }

      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,sku.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching inventory overview:', error);
      return { data: [], error };
    }
  }

  // Get stock alerts and notifications
  async getStockAlerts() {
    try {
      const { data, error } = await supabase
        ?.from('products')
        ?.select('*')
        ?.filter('stock_quantity', 'lte', supabase?.raw('min_stock_level'))
        ?.eq('is_active', true)
        ?.order('stock_quantity', { ascending: true });

      if (error) throw error;

      // Process alerts by severity
      const alerts = (data || [])?.map(product => {
        let severity = 'low';
        let message = '';

        if (product?.stock_quantity === 0) {
          severity = 'critical';
          message = `${product?.name} is out of stock`;
        } else if (product?.stock_quantity <= product?.min_stock_level * 0.5) {
          severity = 'high';
          message = `${product?.name} is critically low (${product?.stock_quantity} remaining)`;
        } else {
          severity = 'medium';
          message = `${product?.name} is below minimum stock level (${product?.stock_quantity}/${product?.min_stock_level})`;
        }

        return {
          ...product,
          severity,
          message,
          alt: `Stock alert for ${product?.name}: ${message}`
        };
      });

      return { data: alerts, error: null };
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      return { data: [], error };
    }
  }

  // Get inventory statistics
  async getInventoryStats() {
    try {
      const { data: allProducts, error: productsError } = await supabase
        ?.from('products')
        ?.select('*');

      if (productsError) throw productsError;

      if (!allProducts?.length) {
        return {
          data: {
            totalProducts: 0,
            totalValue: 0,
            lowStockItems: 0,
            outOfStockItems: 0,
            categoryBreakdown: [],
            stockValueTrend: []
          },
          error: null
        };
      }

      // Calculate metrics
      const totalProducts = allProducts?.length;
      const activeProducts = allProducts?.filter(p => p?.is_active)?.length;
      
      const totalValue = allProducts?.reduce((sum, product) => {
        const price = parseFloat(product?.price || 0);
        const quantity = parseInt(product?.stock_quantity || 0);
        return sum + (price * quantity);
      }, 0);

      const lowStockItems = allProducts?.filter(product => 
        product?.stock_quantity <= product?.min_stock_level && product?.stock_quantity > 0
      )?.length;

      const outOfStockItems = allProducts?.filter(product => 
        product?.stock_quantity === 0
      )?.length;

      // Category breakdown
      const categoryData = allProducts?.reduce((acc, product) => {
        const category = product?.category || 'other';
        if (!acc?.[category]) {
          acc[category] = { count: 0, value: 0 };
        }
        acc[category].count += 1;
        acc[category].value += parseFloat(product?.price || 0) * parseInt(product?.stock_quantity || 0);
        return acc;
      }, {});

      const categoryBreakdown = Object?.entries(categoryData)?.map(([category, data]) => ({
        category: category?.charAt(0)?.toUpperCase() + category?.slice(1),
        count: data?.count,
        value: data?.value,
        percentage: (data?.count / totalProducts * 100)?.toFixed(1),
        alt: `${category} category: ${data?.count} products worth $${data?.value?.toFixed(2)}`
      }));

      // Generate mock trend data (would need historical data for real implementation)
      const stockValueTrend = this.generateStockValueTrend(totalValue);

      return {
        data: {
          totalProducts,
          activeProducts,
          totalValue,
          lowStockItems,
          outOfStockItems,
          categoryBreakdown,
          stockValueTrend,
          turnoverRate: 2.3, // Would need sales data for real calculation
          averageStockLevel: allProducts?.reduce((sum, p) => sum + (p?.stock_quantity || 0), 0) / totalProducts
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      return { data: null, error };
    }
  }

  // Update stock quantity
  async updateStock(productId, newQuantity, reason = 'manual_adjustment') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get current product data
      const { data: currentProduct, error: fetchError } = await supabase
        ?.from('products')
        ?.select('*')
        ?.eq('id', productId)
        ?.single();

      if (fetchError) throw fetchError;

      const oldQuantity = currentProduct?.stock_quantity || 0;
      const quantityDiff = newQuantity - oldQuantity;

      // Update stock
      const { data, error } = await supabase
        ?.from('products')
        ?.update({ 
          stock_quantity: newQuantity,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', productId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Log the stock movement activity
      await this.logStockMovement({
        product_id: productId,
        product_name: currentProduct?.name,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
        quantity_diff: quantityDiff,
        reason,
        user_id: user?.id
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating stock:', error);
      return { data: null, error };
    }
  }

  // Bulk update minimum stock levels
  async bulkUpdateMinStock(updates) {
    try {
      const results = [];
      
      for (const update of updates) {
        const { data, error } = await supabase
          ?.from('products')
          ?.update({ 
            min_stock_level: update?.minStock,
            updated_at: new Date()?.toISOString()
          })
          ?.eq('id', update?.productId)
          ?.select()
          ?.single();

        if (error) {
          console.error(`Error updating ${update?.productId}:`, error);
          results?.push({ productId: update?.productId, success: false, error });
        } else {
          results?.push({ productId: update?.productId, success: true, data });
        }
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error bulk updating min stock:', error);
      return { data: null, error };
    }
  }

  // Get stock movement history  
  async getStockMovementHistory(productId = null, limit = 50) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        ?.from('activities')
        ?.select('*')
        ?.eq('user_id', user?.id)
        ?.eq('activity_type', 'stock_movement')
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (productId) {
        query = query?.eq('related_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching stock movement history:', error);
      return { data: [], error };
    }
  }

  // Generate reorder suggestions
  async getReorderSuggestions() {
    try {
      const { data: lowStockProducts, error } = await supabase
        ?.from('products')
        ?.select('*')
        ?.filter('stock_quantity', 'lte', supabase?.raw('min_stock_level'))
        ?.eq('is_active', true)
        ?.order('stock_quantity', { ascending: true });

      if (error) throw error;

      const suggestions = (lowStockProducts || [])?.map(product => {
        const suggestedQuantity = Math?.max(
          product?.min_stock_level * 2, // Reorder to double minimum
          product?.min_stock_level + 10  // Or minimum + 10, whichever is higher
        );

        return {
          ...product,
          suggestedQuantity,
          reorderCost: parseFloat(product?.cost || product?.price || 0) * suggestedQuantity,
          priority: product?.stock_quantity === 0 ? 'critical' : 'high',
          alt: `Reorder suggestion for ${product?.name}: ${suggestedQuantity} units`
        };
      });

      return { data: suggestions, error: null };
    } catch (error) {
      console.error('Error generating reorder suggestions:', error);
      return { data: [], error };
    }
  }

  // Export inventory data
  async exportInventoryData(format = 'csv') {
    try {
      const { data: products, error } = await this.getInventoryOverview();
      if (error) throw error;

      const exportData = products?.map(product => ({
        SKU: product?.sku || '',
        Name: product?.name || '',
        Category: product?.category || '',
        Price: product?.price || 0,
        Cost: product?.cost || 0,
        'Current Stock': product?.stock_quantity || 0,
        'Min Stock Level': product?.min_stock_level || 0,
        'Stock Status': this.getStockStatus(product),
        'Total Value': (parseFloat(product?.price || 0) * parseInt(product?.stock_quantity || 0))?.toFixed(2),
        Active: product?.is_active ? 'Yes' : 'No'
      }));

      if (format === 'json') {
        return {
          data: JSON?.stringify(exportData, null, 2),
          filename: `inventory-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`,
          error: null
        };
      }

      // For CSV, would need additional CSV formatting logic
      return {
        data: 'CSV export functionality needs implementation',
        filename: `inventory-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`,
        error: null
      };
    } catch (error) {
      console.error('Error exporting inventory data:', error);
      return { data: null, error };
    }
  }

  // Helper methods
  getStockStatus(product) {
    if (!product?.is_active) return 'inactive';
    if (product?.stock_quantity === 0) return 'out_of_stock';
    if (product?.stock_quantity <= product?.min_stock_level) return 'low_stock';
    return 'normal';
  }

  async logStockMovement(movementData) {
    try {
      await supabase?.from('activities')?.insert([{
        title: 'Stock Updated',
        description: `${movementData?.product_name}: ${movementData?.old_quantity} → ${movementData?.new_quantity} (${movementData?.quantity_diff >= 0 ? '+' : ''}${movementData?.quantity_diff})`,
        activity_type: 'stock_movement',
        related_type: 'product',
        related_id: movementData?.product_id,
        user_id: movementData?.user_id,
        metadata: {
          old_quantity: movementData?.old_quantity,
          new_quantity: movementData?.new_quantity,
          quantity_diff: movementData?.quantity_diff,
          reason: movementData?.reason
        }
      }]);
    } catch (error) {
      console.error('Error logging stock movement:', error);
    }
  }

  generateStockValueTrend(currentValue) {
    // Generate mock trend data for the last 7 days
    const trend = [];
    const baseValue = currentValue;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date?.setDate(date?.getDate() - i);
      
      // Add some realistic variance
      const variance = (Math?.random() - 0.5) * 0.1; // ±5% variance
      const value = baseValue * (1 + variance);
      
      trend?.push({
        date: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math?.round(value),
        alt: `Stock value on ${date?.toLocaleDateString()}: $${Math?.round(value)?.toLocaleString()}`
      });
    }
    
    return trend;
  }

  // Real-time subscriptions for inventory
  subscribeToInventoryUpdates(callback) {
    try {
      const channel = supabase?.channel('products-inventory')?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'products'
        },
        callback
      )?.subscribe();

      return () => supabase?.removeChannel(channel);
    } catch (error) {
      console.error('Error subscribing to inventory updates:', error);
      return () => {};
    }
  }
}

export const inventoryService = new InventoryService();