import { supabase } from '../lib/supabase';

// Sales Order CRUD operations
export const salesOrderService = {
  // Get all sales orders for current user
  async getSalesOrders() {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email),
          quotation:quotations(id, quotation_number),
          sales_order_line_items(
            id, item_name, description, quantity, unit_price, line_total, inventory_allocated, sort_order,
            product:products(id, name, sku, stock_quantity)
          ),
          payments(
            id, payment_method, amount, payment_date, status, transaction_id
          )
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get single sales order by ID
  async getSalesOrderById(id) {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email, phone, location),
          quotation:quotations(id, quotation_number),
          sales_order_line_items(
            id, item_name, description, quantity, unit_price, line_total, inventory_allocated, sort_order,
            product:products(id, name, sku, description, stock_quantity, min_stock_level)
          ),
          payments(
            id, payment_method, payment_reference, amount, payment_date, status, transaction_id, notes
          )
        `)?.eq('id', id)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Create new sales order
  async createSalesOrder(orderData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      const orderPayload = {
        ...orderData,
        order_number: orderNumber,
        created_by: user?.id,
        status: orderData?.status || 'pending',
        payment_status: orderData?.payment_status || 'pending'
      };

      const { data, error } = await supabase?.from('sales_orders')?.insert([orderPayload])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update sales order
  async updateSalesOrder(id, updateData) {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.update(updateData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Delete sales order
  async deleteSalesOrder(id) {
    try {
      const { error } = await supabase?.from('sales_orders')?.delete()?.eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  // Generate unique order number
  async generateOrderNumber() {
    const year = new Date()?.getFullYear();
    const { count } = await supabase?.from('sales_orders')?.select('*', { count: 'exact', head: true })?.gte('created_at', `${year}-01-01`)?.lte('created_at', `${year}-12-31`);

    const nextNumber = (count || 0) + 1;
    return `SO-${year}-${nextNumber?.toString()?.padStart(3, '0')}`;
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const updateData = { status };
      
      // Set timestamp fields based on status
      if (status === 'shipped') {
        updateData.shipped_at = new Date()?.toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('sales_orders')?.update(updateData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update payment status
  async updatePaymentStatus(id, paymentStatus) {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.update({ payment_status: paymentStatus })?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update shipping information
  async updateShippingInfo(id, shippingData) {
    try {
      const updateData = {
        shipping_method: shippingData?.shipping_method,
        tracking_number: shippingData?.tracking_number,
        expected_delivery_date: shippingData?.expected_delivery_date,
        shipping_address: shippingData?.shipping_address
      };

      const { data, error } = await supabase?.from('sales_orders')?.update(updateData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get orders by status
  async getOrdersByStatus(status) {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email),
          sales_order_line_items(id, item_name, quantity, unit_price, line_total)
        `)?.eq('status', status)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get pending orders requiring attention
  async getPendingOrders() {
    try {
      const { data, error } = await supabase?.from('sales_orders')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email),
          sales_order_line_items(
            id, item_name, quantity, inventory_allocated,
            product:products(id, name, stock_quantity, min_stock_level)
          )
        `)?.in('status', ['pending', 'confirmed'])?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Sales Order Line Items operations
export const salesOrderLineItemService = {
  // Add line item to sales order
  async addLineItem(salesOrderId, lineItemData) {
    try {
      const lineItem = {
        ...lineItemData,
        sales_order_id: salesOrderId,
        line_total: lineItemData?.quantity * lineItemData?.unit_price
      };

      const { data, error } = await supabase?.from('sales_order_line_items')?.insert([lineItem])?.select(`
          *,
          product:products(id, name, sku, stock_quantity)
        `)?.single();

      if (error) throw error;

      // Check inventory availability
      if (data?.product) {
        await this.checkInventoryAvailability(data?.id, data?.product_id, data?.quantity);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update line item
  async updateLineItem(id, updateData) {
    try {
      const updates = {
        ...updateData,
        line_total: updateData?.quantity * updateData?.unit_price
      };

      const { data, error } = await supabase?.from('sales_order_line_items')?.update(updates)?.eq('id', id)?.select(`
          *,
          product:products(id, name, sku, stock_quantity)
        `)?.single();

      if (error) throw error;

      // Check inventory availability if quantity changed
      if (updateData?.quantity && data?.product) {
        await this.checkInventoryAvailability(id, data?.product_id, data?.quantity);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Remove line item
  async removeLineItem(id) {
    try {
      const { error } = await supabase?.from('sales_order_line_items')?.delete()?.eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  // Check inventory availability
  async checkInventoryAvailability(lineItemId, productId, quantity) {
    try {
      const { data: product, error } = await supabase?.from('products')?.select('stock_quantity, min_stock_level')?.eq('id', productId)?.single();

      if (error) throw error;

      const inventoryAllocated = product?.stock_quantity >= quantity;
      
      // Update line item with inventory status
      await supabase?.from('sales_order_line_items')?.update({ inventory_allocated: inventoryAllocated })?.eq('id', lineItemId);

      return { 
        available: inventoryAllocated, 
        stock_quantity: product?.stock_quantity,
        min_stock_level: product?.min_stock_level
      };
    } catch (error) {
      return { available: false, error: error?.message };
    }
  },

  // Allocate inventory for order
  async allocateInventory(salesOrderId) {
    try {
      const { data: lineItems, error: lineItemsError } = await supabase?.from('sales_order_line_items')?.select(`
          id, product_id, quantity,
          product:products(id, stock_quantity)
        `)?.eq('sales_order_id', salesOrderId);

      if (lineItemsError) throw lineItemsError;

      const updates = [];
      const inventoryUpdates = [];

      for (const item of lineItems || []) {
        const available = item?.product?.stock_quantity >= item?.quantity;
        
        updates?.push({
          id: item?.id,
          inventory_allocated: available
        });

        if (available) {
          inventoryUpdates?.push({
            id: item?.product_id,
            stock_quantity: item?.product?.stock_quantity - item?.quantity
          });
        }
      }

      // Update line item allocation status
      if (updates?.length > 0) {
        const { error: updateError } = await supabase?.from('sales_order_line_items')?.upsert(updates);

        if (updateError) throw updateError;
      }

      // Update product inventory
      if (inventoryUpdates?.length > 0) {
        const { error: inventoryError } = await supabase?.from('products')?.upsert(inventoryUpdates);

        if (inventoryError) throw inventoryError;
      }

      return { success: true, allocated: inventoryUpdates?.length, total: lineItems?.length || 0 };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

// Payment operations
export const paymentService = {
  // Add payment to sales order
  async addPayment(salesOrderId, paymentData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      const payment = {
        ...paymentData,
        sales_order_id: salesOrderId,
        created_by: user?.id,
        payment_date: paymentData?.payment_date || new Date()?.toISOString(),
        status: paymentData?.status || 'pending'
      };

      const { data, error } = await supabase?.from('payments')?.insert([payment])?.select()?.single();

      if (error) throw error;

      // Update sales order payment status
      await this.updateOrderPaymentStatus(salesOrderId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update order payment status based on payments
  async updateOrderPaymentStatus(salesOrderId) {
    try {
      const { data: order, error: orderError } = await supabase?.from('sales_orders')?.select('total_amount')?.eq('id', salesOrderId)?.single();

      if (orderError) throw orderError;

      const { data: payments, error: paymentsError } = await supabase?.from('payments')?.select('amount, status')?.eq('sales_order_id', salesOrderId)?.eq('status', 'paid');

      if (paymentsError) throw paymentsError;

      const totalPaid = payments?.reduce((sum, payment) => sum + payment?.amount, 0) || 0;
      const totalAmount = order?.total_amount || 0;

      let paymentStatus = 'pending';
      if (totalPaid >= totalAmount) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }

      await supabase?.from('sales_orders')?.update({ payment_status: paymentStatus })?.eq('id', salesOrderId);

      return { success: true, payment_status: paymentStatus };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

// Real-time subscriptions for sales orders
export const salesOrderSubscriptions = {
  // Subscribe to sales order changes
  subscribeToSalesOrders(callback) {
    const channel = supabase?.channel('sales_orders')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales_orders' },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // Subscribe to sales order line items changes
  subscribeToSalesOrderLineItems(salesOrderId, callback) {
    const channel = supabase?.channel(`sales_order_line_items_${salesOrderId}`)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'sales_order_line_items',
          filter: `sales_order_id=eq.${salesOrderId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // Subscribe to payment changes
  subscribeToPayments(salesOrderId, callback) {
    const channel = supabase?.channel(`payments_${salesOrderId}`)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'payments',
          filter: `sales_order_id=eq.${salesOrderId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};

export default salesOrderService;