"use client";

import { createUrl } from "@/lib/utils";
import MultiRangeSlider from "multi-range-slider-react";
import "multi-range-slider-react/lib/multirangeslider.css";
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

      <div className="multi-range-slider-container">
        <MultiRangeSlider
          min={0}
          max={parseInt(maxPriceData?.amount)}
          step={5}
          minValue={getMinPrice! || 0}
          maxValue={getMaxPrice! || parseInt(maxPriceData?.amount)}
          ruler={false}
          label={true}
          preventWheel={false}
          baseClassName="multi-range-slider"
          style={{
            border: "none",
            boxShadow: "none",
            padding: "15px 10px",
          }}
          onInput={(e: any) => {
            setMinValue2(e.minValue);
            setMaxValue2(e.maxValue);
          }}
          onChange={(e: any) => {
            minValue2 === 0 && maxValue2 === parseInt(maxPriceData?.amount) ||
              priceChange(e.minValue, e.maxValue);
          }}
        />
        <style jsx>{`
          .multi-range-slider-container :global(.multi-range-slider) {
            border: none;
            box-shadow: none;
            padding: 15px 10px;
          }
          .multi-range-slider-container :global(.multi-range-slider .bar-inner) {
            background-color: #00B4B4;
            border: none;
            box-shadow: none;
          }
          .multi-range-slider-container :global(.multi-range-slider .thumb::before) {
            border: 2px solid #00B4B4;
            box-shadow: none;
          }
          .multi-range-slider-container :global(.multi-range-slider .thumb .caption) {
            background-color: #00B4B4;
            color: white;
            font-size: 0.75rem;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .multi-range-slider-container :global(.multi-range-slider .thumb .caption *) {
            background-color: #00B4B4;
            color: white;
          }
          .multi-range-slider-container :global(.multi-range-slider .bar-left),
          .multi-range-slider-container :global(.multi-range-slider .bar-right) {
            background-color: #E8E8E8;
            box-shadow: none;
            padding: 1px 0;
          }
        `}</style>
      </div>

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
