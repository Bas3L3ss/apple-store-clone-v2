import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/src/@types";

export function useProductConfiguration(product?: Product) {
  const selectionSteps = useMemo(
    () => product?.productSelectionStep ?? [],
    [product?.productSelectionStep]
  );

  const basePrice = product?.basePrice ?? 0;

  const productOptions = useMemo(
    () => product?.productOptions ?? [],
    [product?.productOptions]
  );

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [totalPrice, setTotalPrice] = useState(basePrice);

  useEffect(() => {
    if (!selectionSteps.length) return;

    setSelectedOptions(
      selectionSteps.reduce((acc, step) => {
        acc[step] = "";
        return acc;
      }, {} as Record<string, string>)
    );
  }, [selectionSteps]);

  useEffect(() => {
    console.log("start of effect");
    if (!product) return;

    let newPrice = basePrice;
    const matchedOptionIds = new Set();

    for (const [optionKey, selectedValue] of Object.entries(selectedOptions)) {
      if (!selectedValue) continue;
      for (const option of productOptions) {
        if (matchedOptionIds.has(option._id)) continue;

        // @ts-expect-error: dynamic property access
        if (option[optionKey] === selectedValue) {
          console.log(
            `Adding price ${option.price} for option ${option._id} (${optionKey}=${selectedValue})`
          );
          newPrice += option.price;
          matchedOptionIds.add(option._id);
          break;
        }
      }
    }

    console.log(newPrice, "end of effect");
    setTotalPrice(newPrice);
  }, [selectedOptions, product, basePrice, productOptions]);

  const handleSelect = (value: string, optionType: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType.toLowerCase()]: value,
    }));
  };

  const isConfigurationComplete = () => {
    return selectionSteps.every(
      (step) => selectedOptions[step.toLowerCase()] !== ""
    );
  };

  const getLastStepSelected = () => {
    const lastStep = selectionSteps[selectionSteps.length - 1];
    return lastStep ? selectedOptions[lastStep.toLowerCase()] !== "" : false;
  };

  return {
    selectedOptions,
    totalPrice,
    handleSelect,
    isConfigurationComplete,
    getLastStepSelected,
  };
}
