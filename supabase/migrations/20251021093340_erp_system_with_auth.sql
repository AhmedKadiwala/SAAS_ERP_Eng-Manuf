-- Location: supabase/migrations/20251021093340_erp_system_with_auth.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete ERP system with authentication
-- Dependencies: None (fresh implementation)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.customer_status AS ENUM ('active', 'inactive', 'prospect');
CREATE TYPE public.industry_type AS ENUM ('technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'other');
CREATE TYPE public.relationship_level AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.product_category AS ENUM ('software', 'hardware', 'service', 'consulting', 'other');

-- 2. Core Tables (no foreign keys)

-- Critical intermediary table for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    department TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Company/Organization table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    industry public.industry_type DEFAULT 'other'::public.industry_type,
    size_category TEXT, -- 'startup', 'smb', 'enterprise'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent Tables (with foreign keys)

-- Customers/Contacts
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    status public.customer_status DEFAULT 'prospect'::public.customer_status,
    industry public.industry_type DEFAULT 'other'::public.industry_type,
    location TEXT,
    relationship_score INTEGER DEFAULT 0 CHECK (relationship_score >= 0 AND relationship_score <= 100),
    total_value DECIMAL(12,2) DEFAULT 0.00,
    last_interaction TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[], -- Array of tags like ['enterprise', 'vip', 'high-value']
    is_online BOOLEAN DEFAULT false,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'on_hold', 'cancelled'
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Leads/Opportunities
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.lead_status DEFAULT 'new'::public.lead_status,
    value DECIMAL(12,2),
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    source TEXT, -- 'website', 'referral', 'cold_call', etc.
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category public.product_category DEFAULT 'other'::public.product_category,
    sku TEXT UNIQUE,
    price DECIMAL(10,2),
    cost DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_urls TEXT[],
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    status public.invoice_status DEFAULT 'draft'::public.invoice_status,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.task_status DEFAULT 'todo'::public.task_status,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    due_date DATE,
    completion_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Activity/Timeline entries
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'note', 'task_completed'
    related_type TEXT, -- 'customer', 'lead', 'project', 'invoice'
    related_id UUID, -- ID of the related entity
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    metadata JSONB, -- Additional structured data
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_industry ON public.customers(industry);
CREATE INDEX idx_customers_created_by ON public.customers(created_by);
CREATE INDEX idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_leads_customer_id ON public.leads(customer_id);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_activities_related ON public.activities(related_type, related_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);

-- 5. Functions (MUST BE BEFORE RLS POLICIES)

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function for calculating relationship level from score
CREATE OR REPLACE FUNCTION public.get_relationship_level(score INTEGER)
RETURNS public.relationship_level
LANGUAGE sql
STABLE
AS $$
SELECT CASE 
    WHEN score >= 80 THEN 'excellent'::public.relationship_level
    WHEN score >= 60 THEN 'good'::public.relationship_level
    WHEN score >= 40 THEN 'fair'::public.relationship_level
    ELSE 'poor'::public.relationship_level
END;
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Using correct patterns)

-- Pattern 1: Core user table - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, authenticated write for companies and products
CREATE POLICY "public_can_read_companies"
ON public.companies
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_can_manage_companies"
ON public.companies
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "public_can_read_products"
ON public.products
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_can_manage_products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Pattern 2: Simple user ownership for user-created content
CREATE POLICY "users_manage_own_customers"
ON public.customers
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_own_projects"
ON public.projects
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "users_manage_assigned_leads"
ON public.leads
FOR ALL
TO authenticated
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "users_manage_own_invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_manage_assigned_tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (assigned_to = auth.uid() OR created_by = auth.uid())
WITH CHECK (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "users_manage_own_activities"
ON public.activities
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Triggers

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    company1_uuid UUID := gen_random_uuid();
    customer1_uuid UUID := gen_random_uuid();
    customer2_uuid UUID := gen_random_uuid();
    customer3_uuid UUID := gen_random_uuid();
    customer4_uuid UUID := gen_random_uuid();
    customer5_uuid UUID := gen_random_uuid();
    customer6_uuid UUID := gen_random_uuid();
    project1_uuid UUID := gen_random_uuid();
    lead1_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@modernerp.com', crypt('ModernERP2024!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Administrator", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@modernerp.com', crypt('ModernERP2024!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Project Manager", "role": "manager"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@modernerp.com', crypt('ModernERP2024!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Team Member", "role": "member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Companies
    INSERT INTO public.companies (id, name, description, industry) VALUES
        (company1_uuid, 'ModernERP Solutions', 'Leading ERP software provider', 'technology'::public.industry_type);

    -- Customers (matching the mock data from customer directory)
    INSERT INTO public.customers (
        id, company_name, contact_person, email, phone, avatar_url, status, industry, 
        location, relationship_score, total_value, last_interaction, tags, is_online, created_by
    ) VALUES
        (customer1_uuid, 'Acme Corporation', 'John Smith', 'john.smith@acme.com', '+1 (555) 123-4567',
         'https://images.unsplash.com/photo-1538155421123-6a79813f5deb', 'active'::public.customer_status, 
         'technology'::public.industry_type, 'New York, NY', 85, 125000.00, '2025-10-18T10:30:00Z'::timestamptz,
         ARRAY['enterprise', 'vip'], true, admin_uuid),
        (customer2_uuid, 'Tech Solutions Inc', 'Sarah Johnson', 'sarah.j@techsolutions.com', '+1 (555) 987-6543',
         'https://images.unsplash.com/photo-1684262855358-88f296a2cfc2', 'prospect'::public.customer_status,
         'technology'::public.industry_type, 'San Francisco, CA', 72, 89500.00, '2025-10-19T14:15:00Z'::timestamptz,
         ARRAY['smb', 'high-value'], false, admin_uuid),
        (customer3_uuid, 'Global Healthcare Partners', 'Dr. Michael Chen', 'm.chen@globalhealthcare.com', '+1 (555) 456-7890',
         'https://images.unsplash.com/photo-1558356811-8e77884f44d3', 'active'::public.customer_status,
         'healthcare'::public.industry_type, 'Chicago, IL', 91, 245000.00, '2025-10-20T09:45:00Z'::timestamptz,
         ARRAY['enterprise', 'vip', 'high-value'], true, admin_uuid),
        (customer4_uuid, 'Retail Innovations LLC', 'Emma Rodriguez', 'emma.r@retailinnovations.com', '+1 (555) 321-9876',
         'https://images.unsplash.com/photo-1633192772390-68990d000d73', 'inactive'::public.customer_status,
         'retail'::public.industry_type, 'Austin, TX', 45, 32000.00, '2025-09-15T16:20:00Z'::timestamptz,
         ARRAY['smb', 'at-risk'], false, manager_uuid),
        (customer5_uuid, 'Financial Advisory Group', 'Robert Williams', 'r.williams@financialadvisory.com', '+1 (555) 654-3210',
         'https://images.unsplash.com/photo-1714974528889-d51109fb6ae9', 'active'::public.customer_status,
         'finance'::public.industry_type, 'Boston, MA', 78, 156000.00, '2025-10-21T11:00:00Z'::timestamptz,
         ARRAY['enterprise'], true, manager_uuid),
        (customer6_uuid, 'StartupHub Ventures', 'Alex Kim', 'alex@startuphub.com', '+1 (555) 789-0123',
         'https://images.unsplash.com/photo-1698072556534-40ec6e337311', 'prospect'::public.customer_status,
         'technology'::public.industry_type, 'Seattle, WA', 68, 45000.00, '2025-10-17T13:30:00Z'::timestamptz,
         ARRAY['startup', 'high-value'], false, user_uuid);

    -- Projects
    INSERT INTO public.projects (id, name, description, customer_id, owner_id, status, budget, progress_percentage) VALUES
        (project1_uuid, 'ERP Implementation', 'Full ERP system implementation for Acme Corporation', 
         customer1_uuid, admin_uuid, 'active', 250000.00, 65);

    -- Leads
    INSERT INTO public.leads (id, title, description, customer_id, assigned_to, status, value, probability, source) VALUES
        (lead1_uuid, 'Digital Transformation Project', 'Complete digital transformation initiative', 
         customer2_uuid, manager_uuid, 'qualified'::public.lead_status, 180000.00, 75, 'referral');

    -- Products  
    INSERT INTO public.products (id, name, description, category, sku, price, stock_quantity) VALUES
        (product1_uuid, 'ModernERP Pro', 'Complete ERP solution for enterprises', 
         'software'::public.product_category, 'ERP-PRO-001', 50000.00, 100);

    -- Activities
    INSERT INTO public.activities (title, description, activity_type, related_type, related_id, user_id) VALUES
        ('Customer Meeting', 'Initial consultation with Acme Corporation', 'meeting', 'customer', customer1_uuid, admin_uuid),
        ('Follow-up Call', 'Discussed project timeline and requirements', 'call', 'lead', lead1_uuid, manager_uuid),
        ('Proposal Sent', 'Sent detailed proposal for ERP implementation', 'email', 'project', project1_uuid, admin_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- Create a cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_mock_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mock_user_ids UUID[];
BEGIN
    -- Get mock user IDs
    SELECT ARRAY_AGG(id) INTO mock_user_ids
    FROM auth.users
    WHERE email LIKE '%@modernerp.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.activities WHERE user_id = ANY(mock_user_ids);
    DELETE FROM public.tasks WHERE assigned_to = ANY(mock_user_ids) OR created_by = ANY(mock_user_ids);
    DELETE FROM public.invoices WHERE created_by = ANY(mock_user_ids);
    DELETE FROM public.leads WHERE assigned_to = ANY(mock_user_ids);
    DELETE FROM public.projects WHERE owner_id = ANY(mock_user_ids);
    DELETE FROM public.customers WHERE created_by = ANY(mock_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(mock_user_ids);
    
    -- Delete auth users last
    DELETE FROM auth.users WHERE id = ANY(mock_user_ids);
    
    RAISE NOTICE 'Mock data cleanup completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup error: %', SQLERRM;
END;
$$;