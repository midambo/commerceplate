import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import { useState } from "react";

interface Props {
  value: {
    deliveryArea?: string;
    location?: string;
    phone?: string;
    name?: string;
    cart?: any;
  };
  onChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  updatingLineId?: any;
}

export default function ReviewStep({
  value,
  onNext,
  onBack,
  isSubmitting = false,
  updatingLineId = null,
}: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (orderSuccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center">
          <FaCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Thank You for Your Order!</h2>
        <p className="text-gray-500">Your order has been placed successfully.</p>
        <p className="text-gray-500">We will contact you shortly with delivery details.</p>
      </div>
    );
  }

  if (isConfirmed && isSubmitting) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <h2 className="text-xl font-semibold">Processing Your Order</h2>
        <p className="text-gray-500">Please wait while we confirm your order...</p>
      </div>
    );
  }

  if (!value || !value.deliveryArea || !value.location || !value.phone || !value.name) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Please complete all previous steps first</p>
        <button
          onClick={onBack}
          className="mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Review Your Order</h2>
        <p className="text-gray-500 text-sm">
          Please review your information before placing the order
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Name</span>
            <span className="font-medium">{value.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone</span>
            <span className="font-medium">{value.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Area</span>
            <span className="font-medium capitalize">{value.deliveryArea}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location</span>
            <span className="font-medium">{value.location}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            Back
          </button>
          <button
            onClick={() => {
              setIsConfirmed(true);
              onNext();
              setTimeout(() => setOrderSuccess(true), 2000);
            }}
            disabled={isSubmitting || updatingLineId !== null}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              <>
                Confirm Order
                <FaCheck className="text-sm" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
