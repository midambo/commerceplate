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

const COMMON_LOCATIONS = {
  nairobi: [],
  outside: [
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Thika",
    "Kitale",
    "Malindi",
    "Naivasha",
    "Machakos",
  ]
};

export default function LocationStep({
  value,
  onChange,
  onNext,
  onBack,
  validate,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (value !== location) {
      setLocation(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocation(newValue);
    onChange(newValue);
    setError(null);

    // Show suggestions based on input
    if (newValue.length > 0) {
      const filtered = COMMON_LOCATIONS.outside.filter(loc =>
        loc.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setLocation(suggestion);
    onChange(suggestion);
    setSuggestions([]);
    setError(null);
  };

  const handleContinue = () => {
    if (!location.trim()) {
      setError('Please enter your location');
      return;
    }

    if (location.trim().length < 3) {
      setError('Location must be at least 3 characters');
      return;
    }

    if (validate && !validate(location)) {
      setError('Please enter a valid location');
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
        <h2 className="text-xl font-semibold mb-2">
          Where outside Nairobi should we deliver?
        </h2>
        <p className="text-gray-500 text-sm">
          Enter your city or town name
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Mombasa"
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

          {/* Location Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
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
