"use client";

import { Cart } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { OrderFormData, createOrder } from "@/lib/actions/order";
import DeliveryAreaStep from "@/layouts/components/checkout/steps/DeliveryAreaStep";
import LocationStep from "@/layouts/components/checkout/steps/LocationStep";
import PhoneStep from "@/layouts/components/checkout/steps/PhoneStep";
import NameStep from "@/layouts/components/checkout/steps/NameStep";
import { FaCheck } from "react-icons/fa";

export default function CheckoutForm({ cart }: { cart: Cart }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>({
    deliveryArea: "nairobi",
    location: "",
    phone: "",
    name: "",
    cartId: cart.id
  });

  const steps = [
    {
      title: "Delivery Area",
      component: (
        <DeliveryAreaStep
          value={formData.deliveryArea}
          onChange={(area) => {
            setFormData({ ...formData, deliveryArea: area });
            setStep(2);
          }}
        />
      )
    },
    {
      title: "Location",
      component: (
        <LocationStep
          value={formData.location}
          deliveryArea={formData.deliveryArea}
          onChange={(location) => {
            setFormData({ ...formData, location });
            setStep(3);
          }}
        />
      )
    },
    {
      title: "Contact",
      component: (
        <PhoneStep
          value={formData.phone}
          onChange={(phone) => {
            setFormData({ ...formData, phone });
            setStep(4);
          }}
        />
      )
    },
    {
      title: "Name",
      component: (
        <NameStep
          value={formData.name}
          onSubmit={async (name) => {
            const result = await createOrder({
              ...formData,
              name
            });
            if (result.success) {
              setStep(5);
            }
          }}
        />
      )
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center ${
                i + 1 === step ? "text-primary" : "text-gray-400"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    i + 1 === step
                      ? "border-primary"
                      : i + 1 < step
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <div className="absolute -bottom-6 w-max left-1/2 -translate-x-1/2 text-sm">
                  {s.title}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-full h-0.5 ${
                    i + 1 < step ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        {cart.lines.map((line) => (
          <div key={line.id} className="flex justify-between text-sm py-1">
            <span>
              {line.quantity} × {line.merchandise.product.title}
            </span>
            <span>
              KES{" "}
              {(
                Number(line.cost.totalAmount.amount) * line.quantity
              ).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
          <span>Total</span>
          <span>
            KES {Number(cart.cost.totalAmount.amount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        {step <= 4 ? (
          steps[step - 1].component
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm p-6 text-center"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Thank you for your order, {formData.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              We'll contact you at {formData.phone} to confirm your delivery to{" "}
              {formData.location}.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="btn btn-outline"
            >
              Continue Shopping
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
