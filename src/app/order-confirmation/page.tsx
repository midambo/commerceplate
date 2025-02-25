"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const deliveryArea = searchParams.get("deliveryArea");
  const location = searchParams.get("location");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We&apos;ll deliver your items to:
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-gray-800 font-medium mb-2">Delivery Details:</p>
          <p className="text-gray-600">{location}</p>
          <p className="text-gray-600">{deliveryArea}</p>
        </div>

        {orderNumber && (
          <p className="text-sm text-gray-500 mb-6">
            Order Reference: <span className="font-medium">{orderNumber}</span>
          </p>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            We&apos;ll contact you soon to confirm your delivery time.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
