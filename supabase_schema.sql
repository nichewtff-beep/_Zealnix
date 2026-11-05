-- =========================================================================
-- ZEALNIX STREETWEAR - SUPABASE DATABASE SCHEMA
-- Project ID: iqfcjetndgtayptfceyu
-- URL: https://iqfcjetndgtayptfceyu.supabase.co
-- =========================================================================
-- You can run this script directly in the Supabase Dashboard -> SQL Editor
-- to set up all tables and Row-Level Security (RLS) policies.
-- =========================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    tracking_number TEXT,
    items_count INTEGER DEFAULT 1,
    items JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy queries by email or date
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public/anonymous visitors to insert orders during checkout
DROP POLICY IF EXISTS "Allow anonymous orders insert" ON public.orders;
CREATE POLICY "Allow anonymous orders insert" 
ON public.orders FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

-- Allow reading orders (read-only for authenticated or service_role)
DROP POLICY IF EXISTS "Allow reading orders" ON public.orders;
CREATE POLICY "Allow reading orders" 
ON public.orders FOR SELECT 
TO public, anon, authenticated 
USING (true);

-- Allow updating orders (status, tracking updates)
DROP POLICY IF EXISTS "Allow updating orders" ON public.orders;
CREATE POLICY "Allow updating orders" 
ON public.orders FOR UPDATE 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);


-- 2. ORDER LINE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_size TEXT,
    selected_color TEXT,
    image_url TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    custom_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous order_items insert" ON public.order_items;
CREATE POLICY "Allow anonymous order_items insert" 
ON public.order_items FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading order_items" ON public.order_items;
CREATE POLICY "Allow reading order_items" 
ON public.order_items FOR SELECT 
TO public, anon, authenticated 
USING (true);

-- Allow updating order_items
DROP POLICY IF EXISTS "Allow updating order_items" ON public.order_items;
CREATE POLICY "Allow updating order_items" 
ON public.order_items FOR UPDATE 
TO public, anon, authenticated 
USING (true)
WITH CHECK (true);


-- 3. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id BIGSERIAL PRIMARY KEY,
    ticket_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    reason TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous contact inquiries insert" ON public.contact_inquiries;
CREATE POLICY "Allow anonymous contact inquiries insert" 
ON public.contact_inquiries FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow reading contact inquiries" 
ON public.contact_inquiries FOR SELECT 
TO public, anon, authenticated 
USING (true);


-- 4. CUSTOM STUDIO BESPOKE ORDERS
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    garment_type TEXT NOT NULL,
    garment_name TEXT NOT NULL,
    base_color TEXT NOT NULL,
    size TEXT NOT NULL,
    custom_text TEXT,
    graphic TEXT,
    placement TEXT,
    print_color TEXT,
    price NUMERIC(10, 2) NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous custom_orders insert" ON public.custom_orders;
CREATE POLICY "Allow anonymous custom_orders insert" 
ON public.custom_orders FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading custom_orders" ON public.custom_orders;
CREATE POLICY "Allow reading custom_orders" 
ON public.custom_orders FOR SELECT 
TO public, anon, authenticated 
USING (true);
