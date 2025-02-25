import { Cart } from ".";

export interface LineItem {
  quantity: number;
  variantId: string;
  title: string;
  price: string;
}

export interface OrderInput {
  deliveryArea: "nairobi" | "outside";
  location: string;
  phone: string;
  name: string;
  cartId: string;
  email?: string;
  notes?: string;
  cart?: Cart;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  status: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    location: string;
    deliveryArea: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}
