import mongoose from "mongoose";
import { ProductOptionModel } from "../../../models/ProductOptions";
import { ProductOption } from "../../../@types";

async function saveProductOptions(
  options: any[],
  productId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession
): Promise<mongoose.Types.ObjectId[]> {
  const optionIds: mongoose.Types.ObjectId[] = [];

  for (const option of options) {
    // Skip options that don't have a type or value
    if (!hasValidOptionType(option)) continue;

    const optionData: Partial<ProductOption> = {
      productId,
      price: option.price,
      stock: option.stock,
    };

    // Set the correct option type field
    for (const key in option) {
      if (
        [
          "color",
          "material",
          "storage",
          "size",
          "processor",
          "accessories",
          "carrier",
        ].includes(key) &&
        option[key]
      ) {
        optionData[key] = option[key];
        break; // Ensure only one option type is set
      }
    }

    // For existing options, update them
    if (option._id && !option._id.startsWith("temp-id-")) {
      const existingOption = await ProductOptionModel.findById(option._id);
      if (
        existingOption &&
        existingOption.productId.toString() === productId.toString()
      ) {
        // Clear all option type fields first
        existingOption.color = undefined;
        existingOption.material = undefined;
        existingOption.storage = undefined;
        existingOption.size = undefined;
        existingOption.processor = undefined;
        existingOption.accessories = undefined;
        existingOption.carrier = undefined;

        // Set the new option type and value
        Object.assign(existingOption, optionData);

        await existingOption.save({ session });
        optionIds.push(existingOption._id);
      }
    } else {
      // Create new option
      const newOption = new ProductOptionModel(optionData);
      await newOption.save({ session });
      optionIds.push(newOption._id);
    }
  }

  return optionIds;
}

function hasValidOptionType(option: any): boolean {
  const validOptionTypes = [
    "color",
    "material",
    "storage",
    "size",
    "processor",
    "accessories",
    "carrier",
  ];

  // Check if at least one valid option type exists
  return validOptionTypes.some(
    (type) =>
      option[type] !== undefined && option[type] !== null && option[type] !== ""
  );
}

export { hasValidOptionType, saveProductOptions };
