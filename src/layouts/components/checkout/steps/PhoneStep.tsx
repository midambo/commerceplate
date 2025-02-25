import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  validate?: (value: string) => boolean;
}

export default function PhoneStep({
  value,
  onChange,
  onNext,
  onBack,
  validate,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState(value);

  useEffect(() => {
    if (value !== phone) {
      setPhone(value);
    }
  }, [value]);

  const formatKenyanPhone = (input: string) => {
    // Remove all non-digit characters
    let cleaned = input.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+254' + cleaned.substring(1);
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+254' + cleaned;
    }
    
    // Format for display
    if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    }
    if (cleaned.length > 8) {
      cleaned = cleaned.slice(0, 8) + ' ' + cleaned.slice(8);
    }
    
    return cleaned;
  };

  const validateKenyanPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Must be a valid Kenyan format
    if (cleaned.startsWith('254')) {
      return cleaned.length === 12;
    } else if (cleaned.startsWith('0')) {
      return cleaned.length === 10;
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return cleaned.length === 9;
    }
    
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKenyanPhone(e.target.value);
    setPhone(formatted);
    onChange(formatted);
    setError(null);
  };

  const handleContinue = () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (!validateKenyanPhone(phone)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    if (validate && !validate(phone)) {
      setError('Invalid phone number format');
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What's your phone number?</h2>
        <p className="text-gray-500 text-sm">
          We'll use this to send you delivery updates
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            placeholder="+254 722 000000"
            className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors
              ${error
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-primary'
              }`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Format: 0722000000 or +254722000000
          </p>
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
            onClick={handleContinue}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
