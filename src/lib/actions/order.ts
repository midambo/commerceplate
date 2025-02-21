"use server";

import { TAGS } from "@/lib/constants";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createDraftOrderMutation } from "../shopify/mutations/order";
import { shopifyFetch } from "../shopify";
import { OrderInput } from "../shopify/types/order";
import { sendSMS } from "../services/sms";

export async function createOrder(input: OrderInput) {
  try {
    // Format the input for Shopify's API
    const draftOrderInput = {
      input: {
        note: `Delivery Area: ${input.deliveryArea}\nLocation: ${input.location}`,
        tags: ["custom-checkout", input.deliveryArea],
        customAttributes: [
          { key: "delivery_area", value: input.deliveryArea },
          { key: "location", value: input.location },
          { key: "phone", value: input.phone }
        ],
        customer: {
          firstName: input.name,
          phone: input.phone
        }
      }
    };

    // Create the draft order in Shopify
    const { body } = await shopifyFetch({
      query: createDraftOrderMutation,
      variables: draftOrderInput,
      cache: 'no-store'
    });

    if (body.data?.draftOrderCreate?.userErrors?.length > 0) {
      throw new Error(body.data.draftOrderCreate.userErrors[0].message);
    }

    const order = body.data.draftOrderCreate.draftOrder;

    // Send SMS notification
    await sendSMS({
      to: input.phone,
      message: `Thank you for your order #${order.id}! We'll contact you shortly to arrange delivery to ${input.location}.`
    });

    // Clear the cart
    cookies().delete("cartId");
    revalidateTag(TAGS.cart);

    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
