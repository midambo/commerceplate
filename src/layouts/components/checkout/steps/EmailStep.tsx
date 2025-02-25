"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EmailStepProps {
  value: string;
  onSubmit: (email: string) => void;
}

export default function EmailStep({ value, onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState(value);
  const [confirmEmail, setConfirmEmail] = useState(value);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return;
    }

    if (email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }

    onSubmit(email);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email address"
            className={`block w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">
          Confirm Email Address
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            value={confirmEmail}
            onChange={(e) => {
              setConfirmEmail(e.target.value);
              setError("");
            }}
            placeholder="Confirm your email address"
            className={`block w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              error ? "border-red-500" : ""
            }`}
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Continue
      </button>
    </motion.form>
  );
}
