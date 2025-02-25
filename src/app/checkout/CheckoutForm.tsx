"use client";

import { Cart } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { OrderInput } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createOrder } from "@/lib/actions/order";
import DeliveryAreaStep from "@/layouts/components/checkout/steps/DeliveryAreaStep";
import LocationStep from "@/layouts/components/checkout/steps/LocationStep";
import PhoneStep from "@/layouts/components/checkout/steps/PhoneStep";
import NameStep from "@/layouts/components/checkout/steps/NameStep";
import ReviewStep from "@/layouts/components/checkout/steps/ReviewStep";
import { FaCheckCircle, FaCheck } from "react-icons/fa";
import Link from "next/link";

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

export default function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [deliveryArea, setDeliveryArea] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!cart || !cart.lines || cart.lines.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleSubmit = async () => {
    if (!cart || !cart.lines || cart.lines.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      router.push('/cart');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const orderInput = {
        cartId: cart.id,
        cart: cart,
        deliveryArea,
        location,
        phone,
        name,
      };

      const result = await createOrder(orderInput);
      
      if (result.success) {
        setOrderNumber(result.orderNumber || null);
        
        // Show success message for 4 seconds before redirecting
        setTimeout(() => {
          // Clear cart and redirect
          Cookies.remove('cartId');
          Cookies.remove('cart');
          localStorage.removeItem('cartId');
          localStorage.removeItem('cart');
          Cookies.remove('checkoutUrl');
          localStorage.removeItem('checkoutUrl');
          
          router.push('/');
          router.refresh();
        }, 4000);
      } else {
        setError(result.error || 'Failed to create order');
        setStep(4); 
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Delivery Area',
      data: deliveryArea,
      setData: setDeliveryArea,
      component: DeliveryAreaStep,
      validate: (value: string) => value.length > 0,
    },
    {
      title: 'Location',
      data: location,
      setData: setLocation,
      component: LocationStep,
      validate: (value: string) => value.length >= 3,
    },
    {
      title: 'Phone',
      data: phone,
      setData: setPhone,
      component: PhoneStep,
      validate: (value: string) => /^(?:\+254|0)[17][0-9]{8}$/.test(value.replace(/\s/g, '')),
    },
    {
      title: 'Name',
      data: name,
      setData: setName,
      component: NameStep,
      validate: (value: string) => value.trim().length >= 2,
    },
    {
      title: 'Review',
      data: {
        deliveryArea,
        location,
        phone,
        name,
        cart,
      },
      setData: () => {},
      component: ReviewStep,
      error,
      orderNumber,
      isSubmitting,
    },
  ];

  const goToNextStep = useCallback(() => {
    const currentStep = steps[step - 1];
    
    if (currentStep.validate && !currentStep.validate(currentStep.data)) {
      setError('Please provide valid information before proceeding');
      return;
    }

    if (step < steps.length) {
      setStep(step + 1);
      setError(null);
    } else if (step === steps.length) {
      handleSubmit();
    }
  }, [step, steps, handleSubmit]);

  const goToPreviousStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  }, [step]);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= steps.length) {
      setStep(targetStep);
      setError(null);
    }
  }, [steps.length]);

  if (!cart || !cart.lines || cart.lines.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-4">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/cart" className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90">
          View Cart
        </Link>
      </div>
    );
  }

  const CurrentStep = steps[step - 1].component;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Order Summary - Stripe-like design */}
      <div className="mb-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <span className="text-sm text-gray-500">{cart.lines.length} items</span>
            </div>
            
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                  {line.merchandise.image && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={line.merchandise.image.url}
                        alt={line.merchandise.product.title}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-50"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-gray-700 text-white text-xs font-medium rounded-full">
                        {line.quantity}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{line.merchandise.product.title}</h4>
                    {line.merchandise.title !== 'Default Title' && (
                      <p className="text-sm text-gray-500">{line.merchandise.title}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">
                      {formatPrice(line.cost.totalAmount.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 space-y-3">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(cart.cost.subtotalAmount.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Delivery</span>
              <span className="text-sm">Calculated at next step</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-medium text-xl text-gray-900">
                  {formatPrice(cart.cost.totalAmount.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Checkout Form */}
      <div className="max-w-xl mx-auto">
        {/* Step Numbers */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                    ${i + 1 < step 
                      ? 'border-green-500 bg-green-500 text-white'
                      : i + 1 === step
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-400'}`}
                >
                  {i + 1 < step ? <FaCheck /> : i + 1}
                </div>
                <span className={`text-xs mt-2 font-medium whitespace-nowrap
                  ${i + 1 < step 
                    ? 'text-green-500'
                    : i + 1 === step
                    ? 'text-primary'
                    : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <AnimatePresence mode="wait">
            {step <= steps.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CurrentStep
                  value={steps[step - 1].data}
                  onChange={steps[step - 1].setData}
                  onNext={goToNextStep}
                  onBack={goToPreviousStep}
                  isLastStep={step === steps.length}
                  isSubmitting={isSubmitting}
                  validate={steps[step - 1].validate}
                />
              </motion.div>
            )}

            {step === 4 && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg"
              >
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => setStep(3)}
                  className="mt-2 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mb-4">
                  <FaCheckCircle className="mx-auto text-green-500 text-6xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-4">
                  Thank you for your order. Your order number is:
                  <br />
                  <span className="font-mono text-lg font-bold">{orderNumber}</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Redirecting you to the homepage...
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
