import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import CheckoutForm from "./CheckoutForm";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cartId = cookies().get("cartId")?.value;
  
  if (!cartId) {
    redirect("/");
  }

  const cart = await getCart(cartId);
  
  if (!cart || cart.lines.length === 0) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>
      <CheckoutForm cart={cart} />
    </div>
  );
}
