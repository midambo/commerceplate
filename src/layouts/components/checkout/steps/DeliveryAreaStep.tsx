import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  validate?: (value: string) => boolean;
}

export default function DeliveryAreaStep({ value, onChange, onNext, validate }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(value);

  useEffect(() => {
    if (value !== selected) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    setError(null);
    setSelected(selectedValue);
    onChange(selectedValue);
  };

  const handleContinue = () => {
    if (!selected) {
      setError('Please select a delivery area');
      return;
    }
    
    if (validate && !validate(selected)) {
      setError('Please select a valid delivery area');
      return;
    }
    
    if (onNext) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Where should we deliver your order?
        </h2>
        <p className="text-gray-500 text-sm">
          Choose your delivery area to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleSelect("nairobi")}
          className={`group relative p-6 rounded-lg border-2 transition-all hover:shadow-md
            ${selected === "nairobi"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary"
            }`}
        >
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold mb-2">Within Nairobi</h3>
            <p className="text-sm text-gray-600">Same-day delivery available</p>
            <p className="text-xs text-primary mt-2">From KES 200</p>
          </div>
          <div className={`absolute inset-0 border-2 border-primary rounded-lg transition-opacity
            ${selected === "nairobi" ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          />
        </button>

        <button
          type="button"
          onClick={() => handleSelect("outside")}
          className={`group relative p-6 rounded-lg border-2 transition-all hover:shadow-md
            ${selected === "outside"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary"
            }`}
        >
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold mb-2">Outside Nairobi</h3>
            <p className="text-sm text-gray-600">2-3 days delivery</p>
            <p className="text-xs text-primary mt-2">From KES 500</p>
          </div>
          <div className={`absolute inset-0 border-2 border-primary rounded-lg transition-opacity
            ${selected === "outside" ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          />
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg transition-all
          ${selected
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
      >
        Continue to delivery details
        <FaArrowRight className="text-sm" />
      </button>
    </motion.div>
  );
}
