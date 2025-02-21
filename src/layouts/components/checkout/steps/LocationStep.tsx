import { motion } from "framer-motion";

interface Props {
  value: string;
  deliveryArea: "nairobi" | "outside";
  onChange: (value: string) => void;
}

export default function LocationStep({ value, deliveryArea, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        {deliveryArea === "nairobi"
          ? "Where in Nairobi should we deliver?"
          : "Where outside Nairobi should we deliver?"}
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            deliveryArea === "nairobi"
              ? "e.g., Westlands, Kilimani"
              : "e.g., Nakuru, Mombasa"
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          onClick={() => value && onChange(value)}
          disabled={!value}
          className="w-full btn btn-primary py-3"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
