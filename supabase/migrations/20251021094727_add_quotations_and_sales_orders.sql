-- Location: supabase/migrations/20251021094727_add_quotations_and_sales_orders.sql
-- Schema Analysis: Existing schema has customers, products, invoices, user_profiles
-- Integration Type: PARTIAL_EXISTS - Extending existing invoice functionality with quotations and sales orders
-- Dependencies: customers, products, user_profiles (existing tables)

-- 1. Create new ENUM types for quotations and sales orders
CREATE TYPE public.quotation_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');
CREATE TYPE public.sales_order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded', 'failed');

-- 2. Create quotations table (extends invoice concept)
CREATE TABLE public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status public.quotation_status DEFAULT 'draft'::public.quotation_status,
    valid_until DATE,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    total_amount NUMERIC(12,2) DEFAULT 0.00,
    terms_and_conditions TEXT,
    notes TEXT,
    pdf_url TEXT,
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create quotation line items table
CREATE TABLE public.quotation_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create sales orders table
CREATE TABLE public.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.sales_order_status DEFAULT 'pending'::public.sales_order_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    subtotal NUMERIC(12,2) DEFAULT 0.00,
    tax_rate NUMERIC(5,2) DEFAULT 0.00,
    tax_amount NUMERIC(12,2) DEFAULT 0.00,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    total_amount NUMERIC(12,2) DEFAULT 0.00,
    shipping_address TEXT,
    billing_address TEXT,
    shipping_method TEXT,
    tracking_number TEXT,
    expected_delivery_date DATE,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create sales order line items table
CREATE TABLE public.sales_order_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL,
    inventory_allocated BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create payments table for tracking payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    amount NUMERIC(12,2) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status public.payment_status DEFAULT 'pending'::public.payment_status,
    transaction_id TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create indexes for performance
CREATE INDEX idx_quotations_customer_id ON public.quotations(customer_id);
CREATE INDEX idx_quotations_created_by ON public.quotations(created_by);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotation_line_items_quotation_id ON public.quotation_line_items(quotation_id);
CREATE INDEX idx_quotation_line_items_product_id ON public.quotation_line_items(product_id);

CREATE INDEX idx_sales_orders_customer_id ON public.sales_orders(customer_id);
CREATE INDEX idx_sales_orders_quotation_id ON public.sales_orders(quotation_id);
CREATE INDEX idx_sales_orders_created_by ON public.sales_orders(created_by);
CREATE INDEX idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX idx_sales_order_line_items_sales_order_id ON public.sales_order_line_items(sales_order_id);
CREATE INDEX idx_sales_order_line_items_product_id ON public.sales_order_line_items(product_id);

CREATE INDEX idx_payments_sales_order_id ON public.payments(sales_order_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- 8. Create functions for automatic calculations
CREATE OR REPLACE FUNCTION public.calculate_quotation_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.quotations 
    SET 
        subtotal = (
            SELECT COALESCE(SUM(line_total), 0) 
            FROM public.quotation_line_items 
            WHERE quotation_id = NEW.quotation_id
        ),
        tax_amount = (
            SELECT COALESCE(SUM(line_total), 0) * (tax_rate / 100)
            FROM public.quotation_line_items 
            WHERE quotation_id = NEW.quotation_id
        ),
        total_amount = subtotal + tax_amount - COALESCE(discount_amount, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.quotation_id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_sales_order_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.sales_orders 
    SET 
        subtotal = (
            SELECT COALESCE(SUM(line_total), 0) 
            FROM public.sales_order_line_items 
            WHERE sales_order_id = NEW.sales_order_id
        ),
        tax_amount = (
            SELECT COALESCE(SUM(line_total), 0) * (tax_rate / 100)
            FROM public.sales_order_line_items 
            WHERE sales_order_id = NEW.sales_order_id
        ),
        total_amount = subtotal + tax_amount - COALESCE(discount_amount, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.sales_order_id;
    
    RETURN NEW;
END;
$$;

-- 9. Enable RLS on all new tables
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_quotations"
ON public.quotations
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_quotation_line_items"
ON public.quotation_line_items
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.quotations q 
        WHERE q.id = quotation_line_items.quotation_id 
        AND q.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.quotations q 
        WHERE q.id = quotation_line_items.quotation_id 
        AND q.created_by = auth.uid()
    )
);

CREATE POLICY "users_manage_own_sales_orders"
ON public.sales_orders
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_sales_order_line_items"
ON public.sales_order_line_items
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.sales_orders so 
        WHERE so.id = sales_order_line_items.sales_order_id 
        AND so.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.sales_orders so 
        WHERE so.id = sales_order_line_items.sales_order_id 
        AND so.created_by = auth.uid()
    )
);

CREATE POLICY "users_manage_own_payments"
ON public.payments
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- 11. Create triggers for automatic calculations
CREATE TRIGGER trigger_calculate_quotation_totals
    AFTER INSERT OR UPDATE OR DELETE ON public.quotation_line_items
    FOR EACH ROW EXECUTE FUNCTION public.calculate_quotation_totals();

CREATE TRIGGER trigger_calculate_sales_order_totals
    AFTER INSERT OR UPDATE OR DELETE ON public.sales_order_line_items
    FOR EACH ROW EXECUTE FUNCTION public.calculate_sales_order_totals();

-- 12. Create triggers for updated_at timestamps
CREATE TRIGGER update_quotations_updated_at
    BEFORE UPDATE ON public.quotations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotation_line_items_updated_at
    BEFORE UPDATE ON public.quotation_line_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_orders_updated_at
    BEFORE UPDATE ON public.sales_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_order_line_items_updated_at
    BEFORE UPDATE ON public.sales_order_line_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Add mock data referencing existing records
DO $$
DECLARE
    existing_customer_id UUID;
    existing_user_id UUID;
    existing_product_id UUID;
    quotation_id_1 UUID := gen_random_uuid();
    quotation_id_2 UUID := gen_random_uuid();
    sales_order_id_1 UUID := gen_random_uuid();
BEGIN
    -- Get existing record IDs
    SELECT id INTO existing_customer_id FROM public.customers LIMIT 1;
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    SELECT id INTO existing_product_id FROM public.products LIMIT 1;
    
    -- Only create mock data if existing records are found
    IF existing_customer_id IS NOT NULL AND existing_user_id IS NOT NULL THEN
        -- Insert sample quotations
        INSERT INTO public.quotations (
            id, quotation_number, customer_id, created_by, title, description, 
            status, valid_until, tax_rate, terms_and_conditions
        ) VALUES
            (quotation_id_1, 'QUO-2025-001', existing_customer_id, existing_user_id,
             'Website Redesign Project', 'Complete website redesign with modern UI/UX',
             'sent'::public.quotation_status, CURRENT_DATE + INTERVAL '30 days', 10.00,
             'Payment terms: Net 30 days. Valid for 30 days from issue date.'),
            (quotation_id_2, 'QUO-2025-002', existing_customer_id, existing_user_id,
             'ERP System Implementation', 'Full ERP system setup and configuration',
             'draft'::public.quotation_status, CURRENT_DATE + INTERVAL '45 days', 10.00,
             'Payment terms: 50% upfront, 50% on completion. Valid for 45 days.');

        -- Insert quotation line items
        IF existing_product_id IS NOT NULL THEN
            INSERT INTO public.quotation_line_items (
                quotation_id, product_id, item_name, description, quantity, unit_price, line_total
            ) VALUES
                (quotation_id_1, existing_product_id, 'Website Design', 'Modern responsive website design', 1, 5000.00, 5000.00),
                (quotation_id_1, existing_product_id, 'Development Hours', 'Frontend and backend development', 40, 100.00, 4000.00),
                (quotation_id_2, existing_product_id, 'ERP License', 'Annual software license', 1, 12000.00, 12000.00),
                (quotation_id_2, existing_product_id, 'Implementation Service', 'Setup and configuration service', 1, 8000.00, 8000.00);
        END IF;

        -- Insert sample sales order
        INSERT INTO public.sales_orders (
            id, order_number, quotation_id, customer_id, created_by, status, payment_status,
            tax_rate, shipping_address, billing_address, shipping_method
        ) VALUES
            (sales_order_id_1, 'SO-2025-001', quotation_id_1, existing_customer_id, existing_user_id,
             'confirmed'::public.sales_order_status, 'partial'::public.payment_status, 10.00,
             '123 Main St, New York, NY 10001', '123 Main St, New York, NY 10001', 'Standard Delivery');

        -- Insert sales order line items
        IF existing_product_id IS NOT NULL THEN
            INSERT INTO public.sales_order_line_items (
                sales_order_id, product_id, item_name, description, quantity, unit_price, line_total, inventory_allocated
            ) VALUES
                (sales_order_id_1, existing_product_id, 'Website Design', 'Modern responsive website design', 1, 5000.00, 5000.00, true),
                (sales_order_id_1, existing_product_id, 'Development Hours', 'Frontend and backend development', 40, 100.00, 4000.00, true);
        END IF;

        -- Insert sample payment
        INSERT INTO public.payments (
            sales_order_id, payment_method, payment_reference, amount, status, created_by
        ) VALUES
            (sales_order_id_1, 'Bank Transfer', 'TXN-2025-001', 4500.00, 'paid'::public.payment_status, existing_user_id);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data creation failed: %', SQLERRM;
END $$;