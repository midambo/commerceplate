import { motion } from "framer-motion";

interface Props {
  value: string;
  onSubmit: (value: string) => void;
}

export default function NameStep({ value, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-center mb-6">
        What's your name?
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onSubmit(e.target.value)}
          placeholder="Enter your full name"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={!value}
          className="w-full btn btn-primary py-3"
        >
          Complete Order
        </button>
      </div>
    </motion.form>
  );
}
