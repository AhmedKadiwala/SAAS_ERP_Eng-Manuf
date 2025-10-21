import { supabase } from '../lib/supabase';

// Quotation CRUD operations
export const quotationService = {
  // Get all quotations for current user
  async getQuotations() {
    try {
      const { data, error } = await supabase?.from('quotations')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email),
          quotation_line_items(
            id, item_name, description, quantity, unit_price, line_total, sort_order,
            product:products(id, name, sku)
          )
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get single quotation by ID
  async getQuotationById(id) {
    try {
      const { data, error } = await supabase?.from('quotations')?.select(`
          *,
          customer:customers(id, company_name, contact_person, email, phone, location),
          quotation_line_items(
            id, item_name, description, quantity, unit_price, line_total, sort_order,
            product:products(id, name, sku, description)
          )
        `)?.eq('id', id)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Create new quotation
  async createQuotation(quotationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate quotation number
      const quotationNumber = await this.generateQuotationNumber();

      const quotationPayload = {
        ...quotationData,
        quotation_number: quotationNumber,
        created_by: user?.id,
        status: quotationData?.status || 'draft'
      };

      const { data, error } = await supabase?.from('quotations')?.insert([quotationPayload])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update quotation
  async updateQuotation(id, updateData) {
    try {
      const { data, error } = await supabase?.from('quotations')?.update(updateData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Delete quotation
  async deleteQuotation(id) {
    try {
      const { error } = await supabase?.from('quotations')?.delete()?.eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  // Generate unique quotation number
  async generateQuotationNumber() {
    const year = new Date()?.getFullYear();
    const { count } = await supabase?.from('quotations')?.select('*', { count: 'exact', head: true })?.gte('created_at', `${year}-01-01`)?.lte('created_at', `${year}-12-31`);

    const nextNumber = (count || 0) + 1;
    return `QUO-${year}-${nextNumber?.toString()?.padStart(3, '0')}`;
  },

  // Update quotation status
  async updateQuotationStatus(id, status) {
    try {
      const updateData = { status };
      
      // Set timestamp fields based on status
      if (status === 'sent') {
        updateData.sent_at = new Date()?.toISOString();
      } else if (status === 'accepted') {
        updateData.accepted_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('quotations')?.update(updateData)?.eq('id', id)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Convert quotation to sales order
  async convertToSalesOrder(quotationId) {
    try {
      const { data: quotation, error: quotationError } = await this.getQuotationById(quotationId);
      if (quotationError) throw new Error(quotationError);

      const salesOrderData = {
        quotation_id: quotationId,
        customer_id: quotation?.customer_id,
        status: 'pending',
        payment_status: 'pending',
        subtotal: quotation?.subtotal,
        tax_rate: quotation?.tax_rate,
        tax_amount: quotation?.tax_amount,
        discount_amount: quotation?.discount_amount,
        total_amount: quotation?.total_amount,
        notes: `Converted from quotation ${quotation?.quotation_number}`
      };

      const { data: salesOrder, error: salesOrderError } = await supabase?.from('sales_orders')?.insert([salesOrderData])?.select()?.single();

      if (salesOrderError) throw salesOrderError;

      // Copy line items
      const lineItemsData = quotation?.quotation_line_items?.map(item => ({
        sales_order_id: salesOrder?.id,
        product_id: item?.product_id,
        item_name: item?.item_name,
        description: item?.description,
        quantity: item?.quantity,
        unit_price: item?.unit_price,
        line_total: item?.line_total,
        sort_order: item?.sort_order
      })) || [];

      if (lineItemsData?.length > 0) {
        const { error: lineItemsError } = await supabase?.from('sales_order_line_items')?.insert(lineItemsData);

        if (lineItemsError) throw lineItemsError;
      }

      // Update quotation status to accepted
      await this.updateQuotationStatus(quotationId, 'accepted');

      return { data: salesOrder, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};

// Quotation Line Items operations
export const quotationLineItemService = {
  // Add line item to quotation
  async addLineItem(quotationId, lineItemData) {
    try {
      const lineItem = {
        ...lineItemData,
        quotation_id: quotationId,
        line_total: lineItemData?.quantity * lineItemData?.unit_price
      };

      const { data, error } = await supabase?.from('quotation_line_items')?.insert([lineItem])?.select(`
          *,
          product:products(id, name, sku)
        `)?.single();

      if (error) throw error;
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

      const { data, error } = await supabase?.from('quotation_line_items')?.update(updates)?.eq('id', id)?.select(`
          *,
          product:products(id, name, sku)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Remove line item
  async removeLineItem(id) {
    try {
      const { error } = await supabase?.from('quotation_line_items')?.delete()?.eq('id', id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  // Reorder line items
  async reorderLineItems(lineItems) {
    try {
      const updates = lineItems?.map((item, index) => ({
        id: item?.id,
        sort_order: index
      }));

      const { error } = await supabase?.from('quotation_line_items')?.upsert(updates);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

// Real-time subscriptions for quotations
export const quotationSubscriptions = {
  // Subscribe to quotation changes
  subscribeToQuotations(callback) {
    const channel = supabase?.channel('quotations')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotations' },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // Subscribe to quotation line items changes
  subscribeToQuotationLineItems(quotationId, callback) {
    const channel = supabase?.channel(`quotation_line_items_${quotationId}`)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'quotation_line_items',
          filter: `quotation_id=eq.${quotationId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};

export default quotationService;