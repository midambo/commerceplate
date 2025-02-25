-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum for order status
create type order_status as enum ('pending', 'confirmed', 'delivered', 'cancelled');

-- Create orders table
create table orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique not null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    delivery_area text not null,
    delivery_location text not null,
    total_amount decimal(10,2) not null,
    status order_status default 'pending',
    cart_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create order items table
create table order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    product_id text not null,
    variant_id text not null,
    product_title text not null,
    variant_title text,
    quantity integer not null,
    price decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create analytics views
create view daily_orders as
select 
    date_trunc('day', created_at) as date,
    count(*) as total_orders,
    sum(total_amount) as total_revenue
from orders
group by date_trunc('day', created_at)
order by date_trunc('day', created_at) desc;

create view order_status_summary as
select 
    status,
    count(*) as count,
    sum(total_amount) as total_amount
from orders
group by status;

-- Create RLS policies
alter table orders enable row level security;
alter table order_items enable row level security;

-- Admin can see all orders
create policy "Admin can see all orders"
on orders for select
using (
    auth.role() = 'authenticated'
);

-- Admin can insert orders
create policy "Admin can insert orders"
on orders for insert
using (
    auth.role() = 'authenticated'
);

-- Admin can update orders
create policy "Admin can update orders"
on orders for update
using (
    auth.role() = 'authenticated'
);

-- Similar policies for order items
create policy "Admin can see all order items"
on order_items for select
using (
    auth.role() = 'authenticated'
);

create policy "Admin can insert order items"
on order_items for insert
using (
    auth.role() = 'authenticated'
);

-- Create function to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger update_orders_updated_at
    before update on orders
    for each row
    execute function update_updated_at_column();
