-- Wedding AI Planner Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Creates all core tables for the wedding planning platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('bride', 'vendor', 'admin');

-- Vendor service types
CREATE TYPE vendor_service_type AS ENUM ('hall', 'photographer', 'catering', 'decoration', 'entertainment', 'other');

-- Subscription plans for vendors
CREATE TYPE subscription_plan AS ENUM ('basic', 'professional', 'premium');

-- Bride purchase service types
CREATE TYPE bride_service_type AS ENUM ('ai_planner', 'vendor_directory', 'pdf_export');

-- Vendor inquiry status
CREATE TYPE inquiry_status AS ENUM ('pending', 'read', 'replied');

-- Task created by
CREATE TYPE task_created_by AS ENUM ('ai', 'user');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'bride',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Index for role filtering
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- BRIDE PROFILES TABLE
-- ============================================

CREATE TABLE bride_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wedding_date DATE,
    city VARCHAR(100),
    total_budget DECIMAL(12, 2),
    guest_count INTEGER,
    partner_name VARCHAR(255),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Index for user_id lookups
CREATE INDEX idx_bride_profiles_user_id ON bride_profiles(user_id);

-- Index for city filtering
CREATE INDEX idx_bride_profiles_city ON bride_profiles(city);

-- ============================================
-- VENDOR PROFILES TABLE
-- ============================================

CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    service_type vendor_service_type NOT NULL,
    city VARCHAR(100),
    description TEXT,
    price_range_min DECIMAL(10, 2),
    price_range_max DECIMAL(10, 2),
    is_approved BOOLEAN DEFAULT FALSE,
    subscription_plan subscription_plan DEFAULT 'basic',
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Index for user_id lookups
CREATE INDEX idx_vendor_profiles_user_id ON vendor_profiles(user_id);

-- Index for service type filtering
CREATE INDEX idx_vendor_profiles_service_type ON vendor_profiles(service_type);

-- Index for city filtering
CREATE INDEX idx_vendor_profiles_city ON vendor_profiles(city);

-- Index for approval status
CREATE INDEX idx_vendor_profiles_is_approved ON vendor_profiles(is_approved);

-- ============================================
-- VENDOR PHOTOS TABLE
-- ============================================

CREATE TABLE vendor_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    url VARCHAR(512) NOT NULL,
    alt_text VARCHAR(255),
    is_cover BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for vendor_id lookups
CREATE INDEX idx_vendor_photos_vendor_id ON vendor_photos(vendor_id);

-- Index for cover photos
CREATE INDEX idx_vendor_photos_is_cover ON vendor_photos(is_cover);

-- Index for ordering
CREATE INDEX idx_vendor_photos_display_order ON vendor_photos(display_order);

-- ============================================
-- BRIDE PURCHASES TABLE
-- ============================================

CREATE TABLE bride_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    service_type bride_service_type NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_reference VARCHAR(255),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Index for bride_id lookups
CREATE INDEX idx_bride_purchases_bride_id ON bride_purchases(bride_id);

-- Index for service type
CREATE INDEX idx_bride_purchases_service_type ON bride_purchases(service_type);

-- ============================================
-- VENDOR SUBSCRIPTIONS TABLE
-- ============================================

CREATE TABLE vendor_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_reference VARCHAR(255),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for vendor_id lookups
CREATE INDEX idx_vendor_subscriptions_vendor_id ON vendor_subscriptions(vendor_id);

-- Index for active subscriptions
CREATE INDEX idx_vendor_subscriptions_is_active ON vendor_subscriptions(is_active);

-- ============================================
-- AI CONVERSATIONS TABLE
-- ============================================

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for bride_id lookups
CREATE INDEX idx_ai_conversations_bride_id ON ai_conversations(bride_id);

-- Index for updated_at for sorting
CREATE INDEX idx_ai_conversations_updated_at ON ai_conversations(updated_at DESC);

-- ============================================
-- TASKS TABLE
-- ============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    created_by task_created_by NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for bride_id lookups
CREATE INDEX idx_tasks_bride_id ON tasks(bride_id);

-- Index for completion status
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);

-- Index for due date sorting
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================
-- BUDGET ITEMS TABLE
-- ============================================

CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    estimated_amount DECIMAL(10, 2),
    actual_amount DECIMAL(10, 2),
    vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for bride_id lookups
CREATE INDEX idx_budget_items_bride_id ON budget_items(bride_id);

-- Index for category
CREATE INDEX idx_budget_items_category ON budget_items(category);

-- Index for vendor_id
CREATE INDEX idx_budget_items_vendor_id ON budget_items(vendor_id);

-- ============================================
-- VENDOR INQUIRIES TABLE
-- ============================================

CREATE TABLE vendor_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for bride_id lookups
CREATE INDEX idx_vendor_inquiries_bride_id ON vendor_inquiries(bride_id);

-- Index for vendor_id lookups
CREATE INDEX idx_vendor_inquiries_vendor_id ON vendor_inquiries(vendor_id);

-- Index for status filtering
CREATE INDEX idx_vendor_inquiries_status ON vendor_inquiries(status);

-- ============================================
-- REVIEWS TABLE
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bride_id UUID NOT NULL REFERENCES bride_profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bride_id, vendor_id)
);

-- Index for bride_id lookups
CREATE INDEX idx_reviews_bride_id ON reviews(bride_id);

-- Index for vendor_id lookups
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);

-- Index for verified reviews
CREATE INDEX idx_reviews_is_verified ON reviews(is_verified);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ai_conversations updated_at
CREATE TRIGGER update_ai_conversations_updated_at
    BEFORE UPDATE ON ai_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Basic Setup
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bride_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bride_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Note: Specific RLS policies should be added based on your auth requirements
-- These are placeholders that should be customized for your security needs
