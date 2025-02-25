import { createClient } from '@supabase/supabase-js';
import { Cart } from "@/lib/shopify/types";
import Cookies from 'js-cookie';

// Create a public client specifically for anonymous access
const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false // Don't persist session for anonymous users
    }
  }
);

export interface OrderInput {
  cartId: string;
  email?: string;
  phone: string;
  name: string;
  location: string;
  deliveryArea: string;
  cart: Cart;
}

export interface OrderResponse {
  success: boolean;
  error?: string;
  orderNumber?: string;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

function clearCart() {
  // Clear cart from cookies
  Cookies.remove('cartId');
  Cookies.remove('cart');
  
  // Clear from localStorage
  localStorage.removeItem('cartId');
  localStorage.removeItem('cart');
  
  // Clear any Shopify checkout URL if exists
  Cookies.remove('checkoutUrl');
  localStorage.removeItem('checkoutUrl');
}

export async function createOrder(input: OrderInput): Promise<OrderResponse> {
  try {
    // Validate required fields
    if (!input.name || !input.phone || !input.location || !input.deliveryArea) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Validate cart
    if (!input.cart || !input.cartId) {
      return {
        success: false,
        error: "Invalid cart data",
      };
    }

    // Validate cart items
    if (!input.cart.lines || input.cart.lines.length === 0) {
      return {
        success: false,
        error: "Your cart is empty",
      };
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order using public client
    const { data: order, error: orderError } = await publicSupabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: input.name,
        customer_email: input.email || 'guest@example.com',
        customer_phone: input.phone,
        delivery_area: input.deliveryArea,
        delivery_location: input.location,
        total_amount: input.cart.cost.totalAmount.amount,
        status: 'pending',
        cart_id: input.cartId,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return {
        success: false,
        error: orderError.message || "Failed to create order",
      };
    }

    // Create order items using public client
    const orderItems = input.cart.lines.map(line => ({
      order_id: order.id,
      product_id: line.merchandise.product.id,
      product_title: line.merchandise.product.title,
      variant_title: line.merchandise.title,
      quantity: line.quantity,
      price: line.cost.totalAmount.amount,
      image_url: line.merchandise.image?.url || null,
    }));

    const { error: itemsError } = await publicSupabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Since order was created, we'll still consider this a success
      // but log the error for admin attention
    }

    // Clear cart data after successful order
    clearCart();

    return {
      success: true,
      orderNumber: orderNumber,
    };

  } catch (error) {
    console.error('Order creation error:', error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}