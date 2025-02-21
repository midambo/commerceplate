import { motion } from "framer-motion";

interface Props {
  value: "nairobi" | "outside" | "";
  onChange: (value: "nairobi" | "outside") => void;
}

export default function DeliveryAreaStep({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        Where should we deliver your order?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onChange("nairobi")}
          className={`p-6 rounded-lg border-2 transition-all ${
            value === "nairobi"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary"
          }`}
        >
          <h3 className="font-semibold mb-2">Within Nairobi</h3>
          <p className="text-sm text-gray-600">Same-day delivery available</p>
        </button>
        <button
          onClick={() => onChange("outside")}
          className={`p-6 rounded-lg border-2 transition-all ${
            value === "outside"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary"
          }`}
        >
          <h3 className="font-semibold mb-2">Outside Nairobi</h3>
          <p className="text-sm text-gray-600">2-3 days delivery</p>
        </button>
      </div>
    </motion.div>
  );
}
