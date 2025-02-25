-- First, temporarily disable RLS to test if that's the issue
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow admins to see all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow customers to see own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow customers to create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Access" ON public.orders;
DROP POLICY IF EXISTS "enable_public_order_creation" ON public.orders;
DROP POLICY IF EXISTS "admin_full_access" ON public.orders;

DROP POLICY IF EXISTS "Allow admins to see all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow customers to see own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow customers to create order items" ON public.order_items;
DROP POLICY IF EXISTS "enable_public_order_items_creation" ON public.order_items;

-- Re-enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create single, simple policies
CREATE POLICY "allow_all_orders"
    ON public.orders
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_order_items"
    ON public.order_items
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Ensure proper grants
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.order_items TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant sequence permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO anon, authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
