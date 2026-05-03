-- ==============================================================================
-- BoostX Enterprise Database Schema
-- Generated: 2026
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 0. AUTOMATION & TRIGGERS (updated_at)
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 1. USERS & PROFILES
-- ==========================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('CLIENT', 'AGENCY_OWNER', 'AGENCY_EMPLOYEE', 'FREELANCER', 'ADMIN', 'SUPPORT', 'FINANCE', 'CONTENT_MANAGER')),
    country_code VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.provider_profiles (
    provider_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT[],
    rating_avg NUMERIC(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    response_time VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(50) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    commercial_registration VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'WORKING_NOW', 'BUSY', 'OFFLINE')),
    current_task_title VARCHAR(255),
    started_at TIMESTAMPTZ,
    expected_end_at TIMESTAMPTZ,
    timer_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. FINANCE, PAYMENTS & WALLETS
-- ==========================================

CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    coins_balance INTEGER DEFAULT 0,
    country_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    reason VARCHAR(100),
    related_entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.payment_gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10),
    supported_currencies TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    config_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE RESTRICT,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('ORDER', 'COINS_PACKAGE', 'SUBSCRIPTION', 'STORY_AD')),
    related_entity_id UUID NOT NULL, -- ID of Order, Coin Package, Subscription, or Ad Order
    amount NUMERIC(10,2) NOT NULL,
    gateway_fee NUMERIC(10,2) DEFAULT 0.0,
    net_amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    transaction_reference VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- ==========================================
-- 3. SERVICES & LEADS
-- ==========================================

CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    delivery_days INTEGER NOT NULL,
    views_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    service_category_id UUID REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    budget_range VARCHAR(100),
    city VARCHAR(100),
    client_contact_hidden VARCHAR(255), -- Masked phone/email
    contact_unlock_price_coins INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- ==========================================
-- 4. ORDERS & EXECUTION
-- ==========================================

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    assigned_employee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'REVISION', 'COMPLETED', 'CANCELLED')),
    agreed_price NUMERIC(10,2) NOT NULL,
    platform_fee NUMERIC(10,2) DEFAULT 0.0,
    provider_earning NUMERIC(10,2) NOT NULL,
    revision_count INTEGER DEFAULT 0,
    deadline_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- ==========================================
-- 5. SUBSCRIPTIONS & PLANS
-- ==========================================

CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    country_code VARCHAR(10),
    duration_days INTEGER NOT NULL,
    max_services INTEGER DEFAULT 5,
    max_portfolio_items INTEGER DEFAULT 10,
    allow_contact_display BOOLEAN DEFAULT FALSE,
    allow_ads_stories BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- ==========================================
-- 6. INDEXES & PERFORMANCE
-- ==========================================

CREATE INDEX idx_users_account_type ON public.users(account_type);
CREATE INDEX idx_users_country_code ON public.users(country_code);
CREATE INDEX idx_services_provider_id ON public.services(provider_id);
CREATE INDEX idx_services_category_id ON public.services(category_id);
CREATE INDEX idx_leads_client_id ON public.leads(client_id);
CREATE INDEX idx_leads_city ON public.leads(city);
CREATE INDEX idx_orders_provider_id ON public.orders(provider_id);
CREATE INDEX idx_orders_client_id ON public.orders(client_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_payments_status ON public.payments(status);

-- ==========================================
-- 7. TRIGGERS
-- ==========================================

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_provider_profiles_modtime BEFORE UPDATE ON public.provider_profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_provider_availability_modtime BEFORE UPDATE ON public.provider_availability FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==========================================
-- 8. SECURITY & RLS (Row Level Security)
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Example Secure RLS: Payments table is Read-Only for involved parties, completely locked for writes from UI
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "No direct inserts to payments from UI" ON public.payments
    FOR INSERT
    WITH CHECK (false); -- Handled by secure server actions only

CREATE POLICY "No direct updates to payments from UI" ON public.payments
    FOR UPDATE
    USING (false);

-- Orders: Clients and Providers can view their orders
CREATE POLICY "Clients can view their orders" ON public.orders
    FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Providers can view their orders" ON public.orders
    FOR SELECT
    USING (auth.uid() = provider_id);

-- End of Schema Snapshot
