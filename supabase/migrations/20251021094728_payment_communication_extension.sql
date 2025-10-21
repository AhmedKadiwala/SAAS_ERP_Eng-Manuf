-- Location: supabase/migrations/20251021094728_payment_communication_extension.sql
-- Schema Analysis: Existing ERP system with customers, invoices, activities, user_profiles tables
-- Integration Type: Extension - adding payment tracking and communication management
-- Dependencies: customers, invoices, user_profiles, activities tables

-- 1. New ENUM types for payment and communication features
CREATE TYPE public.payment_method_type AS ENUM ('credit_card', 'bank_transfer', 'paypal', 'stripe', 'cash', 'check');
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE public.communication_channel AS ENUM ('email', 'sms', 'phone', 'whatsapp', 'slack', 'teams');
CREATE TYPE public.communication_status AS ENUM ('draft', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'failed');
CREATE TYPE public.template_type AS ENUM ('email', 'sms', 'notification', 'follow_up');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- 2. Payment Methods table
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    method_type public.payment_method_type NOT NULL,
    method_name TEXT NOT NULL,
    account_number TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Payment Transactions table  
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    transaction_reference TEXT UNIQUE,
    amount NUMERIC(15,2) NOT NULL,
    currency_code TEXT DEFAULT 'USD',
    exchange_rate NUMERIC(10,4) DEFAULT 1.0000,
    status public.payment_status DEFAULT 'pending',
    payment_date TIMESTAMPTZ,
    due_date DATE,
    notes TEXT,
    gateway_response JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Communication Templates table
CREATE TABLE public.communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    template_type public.template_type NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Communication Campaigns table
CREATE TABLE public.communication_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.communication_templates(id) ON DELETE SET NULL,
    campaign_name TEXT NOT NULL,
    channel public.communication_channel NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    status public.communication_status DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Communication Logs table (extends activities)
CREATE TABLE public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.communication_campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.communication_templates(id) ON DELETE SET NULL,
    channel public.communication_channel NOT NULL,
    subject TEXT,
    content TEXT,
    recipient_email TEXT,
    recipient_phone TEXT,
    status public.communication_status DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    response_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Follow Up Tasks table
CREATE TABLE public.follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    task_description TEXT,
    priority public.priority_level DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    reminder_sent BOOLEAN DEFAULT false,
    related_communication_id UUID REFERENCES public.communication_logs(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_customer_id ON public.payment_methods(customer_id);
CREATE INDEX idx_payment_transactions_invoice_id ON public.payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_customer_id ON public.payment_transactions(customer_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_communication_templates_user_id ON public.communication_templates(user_id);
CREATE INDEX idx_communication_campaigns_user_id ON public.communication_campaigns(user_id);
CREATE INDEX idx_communication_logs_customer_id ON public.communication_logs(customer_id);
CREATE INDEX idx_communication_logs_campaign_id ON public.communication_logs(campaign_id);
CREATE INDEX idx_follow_up_tasks_customer_id ON public.follow_up_tasks(customer_id);
CREATE INDEX idx_follow_up_tasks_assigned_to ON public.follow_up_tasks(assigned_to);

-- 9. Update triggers
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at
    BEFORE UPDATE ON public.communication_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_campaigns_updated_at
    BEFORE UPDATE ON public.communication_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_follow_up_tasks_updated_at
    BEFORE UPDATE ON public.follow_up_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies using Pattern 2 (Simple User Ownership)
CREATE POLICY "users_manage_own_payment_methods"
ON public.payment_methods
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_payment_transactions"
ON public.payment_transactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_communication_templates"
ON public.communication_templates
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_communication_campaigns"
ON public.communication_campaigns
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_communication_logs"
ON public.communication_logs
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS for follow_up_tasks - can access if assigned to user or created by user
CREATE POLICY "users_can_view_assigned_tasks"
ON public.follow_up_tasks
FOR SELECT
TO authenticated
USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "users_can_create_tasks"
ON public.follow_up_tasks
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_can_update_assigned_tasks"
ON public.follow_up_tasks
FOR UPDATE
TO authenticated
USING (assigned_to = auth.uid() OR created_by = auth.uid())
WITH CHECK (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "users_can_delete_own_tasks"
ON public.follow_up_tasks
FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- 12. Mock Data
DO $$
DECLARE
    existing_user_id UUID;
    existing_customer_id UUID;
    existing_invoice_id UUID;
    payment_method_id UUID := gen_random_uuid();
    transaction_id UUID := gen_random_uuid();
    template_id UUID := gen_random_uuid();
    campaign_id UUID := gen_random_uuid();
    log_id UUID := gen_random_uuid();
BEGIN
    -- Get existing records
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    SELECT id INTO existing_customer_id FROM public.customers LIMIT 1;
    SELECT id INTO existing_invoice_id FROM public.invoices LIMIT 1;

    IF existing_user_id IS NOT NULL AND existing_customer_id IS NOT NULL THEN
        -- Insert payment methods
        INSERT INTO public.payment_methods (id, user_id, customer_id, method_type, method_name, account_number, is_default)
        VALUES 
            (payment_method_id, existing_user_id, existing_customer_id, 'credit_card', 'Visa ending 4242', '**** **** **** 4242', true),
            (gen_random_uuid(), existing_user_id, existing_customer_id, 'bank_transfer', 'Bank of America', 'ACC-123456789', false);

        -- Insert payment transactions
        IF existing_invoice_id IS NOT NULL THEN
            INSERT INTO public.payment_transactions (id, invoice_id, payment_method_id, customer_id, user_id, transaction_reference, amount, status, payment_date)
            VALUES 
                (transaction_id, existing_invoice_id, payment_method_id, existing_customer_id, existing_user_id, 'TXN-2025-001', 2500.00, 'completed', NOW() - INTERVAL '2 days'),
                (gen_random_uuid(), existing_invoice_id, payment_method_id, existing_customer_id, existing_user_id, 'TXN-2025-002', 1250.00, 'pending', NULL);
        END IF;

        -- Insert communication templates
        INSERT INTO public.communication_templates (id, user_id, template_name, template_type, subject, content)
        VALUES 
            (template_id, existing_user_id, 'Payment Reminder', 'email', 'Payment Reminder - Invoice #{invoice_number}', 'Dear {customer_name}, This is a friendly reminder that payment for invoice #{invoice_number} is due. Amount: ${amount}'),
            (gen_random_uuid(), existing_user_id, 'Welcome Message', 'email', 'Welcome to our service!', 'Hi {customer_name}, Welcome to our platform! We are excited to work with you.');

        -- Insert communication campaigns
        INSERT INTO public.communication_campaigns (id, user_id, template_id, campaign_name, channel, recipient_count, sent_count, status)
        VALUES 
            (campaign_id, existing_user_id, template_id, 'Q4 Payment Reminders', 'email', 25, 23, 'sent'),
            (gen_random_uuid(), existing_user_id, template_id, 'New Customer Welcome', 'email', 10, 10, 'sent');

        -- Insert communication logs
        INSERT INTO public.communication_logs (id, customer_id, user_id, campaign_id, template_id, channel, subject, content, recipient_email, status, sent_at)
        VALUES 
            (log_id, existing_customer_id, existing_user_id, campaign_id, template_id, 'email', 'Payment Reminder - Invoice #INV-001', 'Payment reminder email content', 'john.smith@acme.com', 'delivered', NOW() - INTERVAL '1 day'),
            (gen_random_uuid(), existing_customer_id, existing_user_id, campaign_id, template_id, 'email', 'Welcome to our service!', 'Welcome email content', 'john.smith@acme.com', 'opened', NOW() - INTERVAL '3 days');

        -- Insert follow-up tasks
        INSERT INTO public.follow_up_tasks (customer_id, assigned_to, created_by, task_title, task_description, priority, due_date, related_communication_id)
        VALUES 
            (existing_customer_id, existing_user_id, existing_user_id, 'Follow up on overdue payment', 'Call customer regarding overdue invoice #INV-001', 'high', NOW() + INTERVAL '1 day', log_id),
            (existing_customer_id, existing_user_id, existing_user_id, 'Send project proposal', 'Prepare and send detailed project proposal based on initial consultation', 'medium', NOW() + INTERVAL '3 days', NULL);
    END IF;

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;