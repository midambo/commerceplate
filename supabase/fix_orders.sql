-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow admins to see all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow customers to see own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow customers to create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Access" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to see all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow customers to see own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow customers to create order items" ON public.order_items;

-- Make sure tables exist and have correct structure
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number text NOT NULL UNIQUE,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    delivery_area text NOT NULL,
    delivery_location text NOT NULL,
    total_amount decimal(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    cart_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id text NOT NULL,
    product_title text NOT NULL,
    variant_title text,
    quantity integer NOT NULL CHECK (quantity > 0),
    price decimal(10,2) NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create a secure function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    CASE WHEN auth.jwt() ->> 'email' = 'gregmidambo2@gmail.com' THEN true
    ELSE false
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for orders table

-- Allow anonymous users to create orders (needed for guest checkout)
CREATE POLICY "Allow anonymous order creation"
    ON public.orders
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow admins to see all orders
CREATE POLICY "Admin can view all orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (is_admin());

-- Allow admins to update orders
CREATE POLICY "Admin can update orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Allow admins to delete orders
CREATE POLICY "Admin can delete orders"
    ON public.orders
    FOR DELETE
    TO authenticated
    USING (is_admin());

-- Create policies for order_items table

-- Allow anonymous users to create order items (needed for guest checkout)
CREATE POLICY "Allow anonymous order items creation"
    ON public.order_items
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow admins to view all order items
CREATE POLICY "Admin can view all order items"
    ON public.order_items
    FOR SELECT
    TO authenticated
    USING (is_admin());

-- Allow admins to update order items
CREATE POLICY "Admin can update order items"
    ON public.order_items
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- Allow admins to delete order items
CREATE POLICY "Admin can delete order items"
    ON public.order_items
    FOR DELETE
    TO authenticated
    USING (is_admin());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.orders TO anon, authenticated;
GRANT ALL ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.order_status_summary TO anon, authenticated;
GRANT SELECT ON public.order_details TO anon, authenticated;

-- Ensure sequences are granted
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Verify the current user has necessary permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.role_table_grants
    WHERE grantee = 'anon'
    AND table_name = 'orders'
    AND privilege_type = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Anonymous users do not have INSERT permission on orders table';
  END IF;
END $$;
