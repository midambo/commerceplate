"use client";

import { addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCart } from "@/lib/shopify";
import Cookies from "js-cookie";

interface PlaceOrderButtonProps {
  variants: any[];
  availableForSale: boolean;
  handle: string;
  defaultVariantId?: string;
}

export function PlaceOrderButton({
  variants,
  availableForSale,
  handle,
  defaultVariantId,
}: PlaceOrderButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      
      // Add to cart first
      if (!defaultVariantId) {
        throw new Error("No variant selected");
      }

      // Get or create cart
      let cartId = Cookies.get("cartId");
      if (!cartId) {
        const cart = await getCart();
        cartId = cart.id;
        Cookies.set("cartId", cartId);
      }

      // Add item to cart
      await addToCart(cartId, [{
        merchandiseId: defaultVariantId,
        quantity: 1
      }]);

      // Redirect to checkout
      router.push("/checkout");
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      className="btn btn-outline-primary w-full text-center"
      disabled={!availableForSale || isLoading}
    >
      {isLoading ? "Adding to Cart..." : "Place Order Now"}
    </button>
  );
}
