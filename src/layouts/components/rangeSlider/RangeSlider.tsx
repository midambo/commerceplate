"use client";

import { createUrl } from "@/lib/utils";
import MultiRangeSlider from "multi-range-slider-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import "./rangeSlider.css";

const RangeSlider = ({
  maxPriceData,
}: {
  maxPriceData: { amount: string; currencyCode: string };
}) => {
  const [minValue2, setMinValue2] = useState(0);
  const [maxValue2, setMaxValue2] = useState(parseInt(maxPriceData?.amount));

  const router = useRouter();
  const searchParams = useSearchParams();
  const getMinPrice = searchParams.get("minPrice");
  const getMaxPrice = searchParams.get("maxPrice");

  function priceChange(minValue: number, maxValue: number) {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("minPrice", minValue.toString());
    newParams.set("maxPrice", maxValue.toString());
    router.push(createUrl("/products", newParams), { scroll: false });
  }

  return (
    <div>
      <div className="flex justify-between">
        <p>
          Ksh. {new Intl.NumberFormat("en-US").format(minValue2)}
        </p>
        <p>
          Ksh. {new Intl.NumberFormat("en-US").format(maxValue2)}
        </p>
      </div>

      <MultiRangeSlider
        style={{ border: "none", boxShadow: "none" }}
        min={0}
        max={`${maxPriceData?.amount}`}
        minValue={getMinPrice! || 0}
        maxValue={getMaxPrice! || parseInt(maxPriceData?.amount)}
        onInput={(e: any) => {
          setMinValue2(e.minValue);
          setMaxValue2(e.maxValue);
        }}
        onChange={(e: any) => {
          minValue2 === 0 && maxValue2 === parseInt(maxPriceData?.amount) ||
            priceChange(e.minValue, e.maxValue);
        }}
        label={false}
        ruler={false}
        className="py-4"
      />

      {(minValue2 === parseInt(getMinPrice!) &&
        maxValue2 === parseInt(getMaxPrice!)) ||
        (minValue2 === 0 && maxValue2 === parseInt(maxPriceData?.amount)) || (
          <button
            onClick={() => priceChange(minValue2, maxValue2)}
            className="btn btn-sm btn-outline-primary mt-4 w-full"
          >
            Apply
          </button>
        )}
    </div>
  );
};

export default RangeSlider;
