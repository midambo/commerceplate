-- Drop conflicting policies
DROP POLICY IF EXISTS "Allow customers to create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow customers to create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin Access" ON public.orders;

-- Create a more permissive policy for order creation
CREATE POLICY "enable_public_order_creation"
    ON public.orders
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create a more permissive policy for order items creation
CREATE POLICY "enable_public_order_items_creation"
    ON public.order_items
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Update admin access to be more specific
CREATE POLICY "admin_full_access"
    ON public.orders
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'gregmidambo2@gmail.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'gregmidambo2@gmail.com');

-- Ensure proper grants exist
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.orders TO anon;
GRANT ALL ON public.order_items TO anon;

-- Grant sequence usage (important for ID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
