import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneStep({ value, onChange }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmed) {
      onChange(value);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        What's your phone number?
      </h2>
      <div className="space-y-4">
        <input
          type="tel"
          value={value}
          onChange={(e) => {
            setConfirmed(false);
            onChange(e.target.value);
          }}
          placeholder="e.g., 0712345678"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          pattern="[0-9]{10}"
          required
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="confirm" className="text-sm">
            I confirm that {value} is my correct phone number
          </label>
        </div>
        <button
          type="submit"
          disabled={!confirmed || !value}
          className="w-full btn btn-primary py-3"
        >
          Continue
        </button>
      </div>
    </motion.form>
  );
}
