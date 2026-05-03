-- ==============================================================================
-- BoostX Super App Enterprise Database Schema V4 (Final)
-- Includes: Escrow, Advanced Negotiations, Auto-Expire Timers, Negotiation Fees, and Strict RLS.
-- ==============================================================================

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
-- 1. USERS, ROLES & PROFILES
-- ==========================================

CREATE TABLE public.countries (
    country_code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(10) NOT NULL,
    symbol VARCHAR(5),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('CLIENT', 'AGENCY_OWNER', 'AGENCY_EMPLOYEE', 'FREELANCER', 'ADMIN', 'SUPPORT', 'FINANCE', 'CONTENT_MANAGER')),
    country_code VARCHAR(10) REFERENCES public.countries(country_code),
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
    completed_orders INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
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
    country_code VARCHAR(10) REFERENCES public.countries(country_code),
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
    name VARCHAR(100) NOT NULL, -- e.g., Tap Payments, Stripe, Vodafone Cash
    country_code VARCHAR(10),
    supported_currencies TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    config_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE RESTRICT,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('ORDER', 'COINS_PACKAGE', 'SUBSCRIPTION', 'STORY_AD', 'NEGOTIATION_FEE')),
    related_entity_id UUID NOT NULL,
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
    requested_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    budget_range VARCHAR(100),
    city VARCHAR(100),
    client_contact_hidden VARCHAR(255),
    contact_unlock_price_coins INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'EXPIRED')),
    expires_at TIMESTAMPTZ, -- Auto-expire lead if no one buys it
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- ==========================================
-- 4. ORDERS, NEGOTIATIONS & ESCROW
-- ==========================================

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    
    -- Request & Negotiation Specs
    urgency_level VARCHAR(50) DEFAULT 'NORMAL' CHECK (urgency_level IN ('NORMAL', 'URGENT', 'EXPRESS')),
    client_budget NUMERIC(10,2),
    requested_delivery_date DATE,
    requested_days INTEGER,
    negotiation_enabled BOOLEAN DEFAULT TRUE,
    is_negotiation_locked BOOLEAN DEFAULT FALSE, -- Lock negotiation once accepted
    
    -- Status & Financials
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'NEGOTIATION', 'IN_PROGRESS', 'REVISION', 'COMPLETED', 'CANCELLED', 'EXPIRED')),
    agreed_price NUMERIC(10,2),
    platform_fee NUMERIC(10,2) DEFAULT 0.0,
    provider_earning NUMERIC(10,2),
    
    -- Delivery & Penalties
    deadline_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delay_status VARCHAR(50) DEFAULT 'ON_TIME' CHECK (delay_status IN ('ON_TIME', 'DELAYED', 'CRITICAL')),
    penalty_applied BOOLEAN DEFAULT FALSE,
    penalty_amount NUMERIC(10,2) DEFAULT 0.0,
    expires_at TIMESTAMPTZ, -- Order expires if provider ignores it
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.order_negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    offer_amount NUMERIC(10,2) NOT NULL,
    proposed_delivery_days INTEGER NOT NULL,
    negotiation_fee NUMERIC(10,2) DEFAULT 0.0, -- Fee deducted for making a bid
    message TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED')),
    expires_at TIMESTAMPTZ, -- Offer expires automatically
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    amount NUMERIC(10,2) NOT NULL,
    platform_fee NUMERIC(10,2) NOT NULL,
    provider_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'HELD' CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')),
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.delivery_penalties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    delay_hours INTEGER NOT NULL,
    penalty_amount NUMERIC(10,2) NOT NULL,
    penalty_type VARCHAR(50) CHECK (penalty_type IN ('FIXED', 'PERCENTAGE')),
    reason TEXT,
    applied_by VARCHAR(50) CHECK (applied_by IN ('SYSTEM', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 5. ORDER CHAT & MODERATION
-- ==========================================

CREATE TABLE public.order_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    provider_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOCKED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.order_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'LINK')),
    attachment_url VARCHAR(255),
    external_link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    blocked_content_flag BOOLEAN DEFAULT FALSE,
    warning_shown BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(50) DEFAULT 'SAFE' CHECK (moderation_status IN ('SAFE', 'FLAGGED', 'BLOCKED', 'REVIEWED_BY_ADMIN')),
    created_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.blocked_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(255) NOT NULL,
    regex_pattern VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 6. INDEXES & PERFORMANCE
-- ==========================================
CREATE INDEX idx_users_account_type ON public.users(account_type);
CREATE INDEX idx_users_country_code ON public.users(country_code);
CREATE INDEX idx_services_provider_id ON public.services(provider_id);
CREATE INDEX idx_orders_client_id ON public.orders(client_id);
CREATE INDEX idx_orders_provider_id ON public.orders(provider_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_expires_at ON public.orders(expires_at);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_order_messages_conversation_id ON public.order_messages(conversation_id);
CREATE INDEX idx_order_negotiations_order_id ON public.order_negotiations(order_id);
CREATE INDEX idx_order_negotiations_expires_at ON public.order_negotiations(expires_at);

-- ==========================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==========================================
-- 8. SECURITY & RLS (Row Level Security)
-- ==========================================

-- Enable RLS on core sensitive tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Escrow: Strict read-only for clients/providers, NO inserts from UI
CREATE POLICY "Users can view their escrow" ON public.escrow_transactions
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "No direct inserts to escrow" ON public.escrow_transactions
    FOR INSERT WITH CHECK (false); 

CREATE POLICY "No direct updates to escrow" ON public.escrow_transactions
    FOR UPDATE USING (false);

-- Payments: Strict read-only for clients
CREATE POLICY "Users can view their payments" ON public.payments
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "No direct inserts to payments" ON public.payments
    FOR INSERT WITH CHECK (false);

CREATE POLICY "No direct updates to payments" ON public.payments
    FOR UPDATE USING (false);

-- Chat: Strict participant-only access
CREATE POLICY "Chat viewable by participants only" ON public.order_conversations
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Messages viewable by participants only" ON public.order_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT client_id FROM public.order_conversations WHERE id = order_messages.conversation_id
            UNION
            SELECT provider_id FROM public.order_conversations WHERE id = order_messages.conversation_id
        )
    );

-- End of Master Schema V4
