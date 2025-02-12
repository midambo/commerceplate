import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "KES",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  // Format amount with commas and no decimals
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(parseFloat(amount)));

  return (
    <p suppressHydrationWarning={true} className={className}>
      {`Ksh. ${formattedAmount}`}
    </p>
  );
};

export default Price;
