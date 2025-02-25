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

export default function NameStep({
  value,
  onChange,
  onNext,
  onBack,
  validate,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(value);

  useEffect(() => {
    if (value !== name) {
      setName(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    onChange(newValue);
    setError(null);
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (validate && !validate(name)) {
      setError('Please enter a valid name');
      return;
    }

    onNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">What's your name?</h2>
        <p className="text-gray-500 text-sm">
          Enter your full name as it appears on your ID
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g., John Doe"
            className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors
              ${error
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-primary'
              }`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
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
