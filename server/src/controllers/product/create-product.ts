import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/Product";
import mongoose from "mongoose";
import { saveProductOptions } from "./utils";
import cloudinary from "../../utils/cloudinary";
import redis from "../../utils/redis";

export const CreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const uploadedImagePublicIds: string[] = []; // Track uploaded images

  try {
    const {
      name,
      description,
      slug,
      basePrice,
      category,
      stock,
      isFeatured: unParsedIsFeatured,
      productSelectionStep: unParsedProductSelectionStep,
      productOptions: unParsedProductOptions,
    } = req.body;
    const productImages = req.files;

    const productSelectionStep = JSON.parse(unParsedProductSelectionStep);
    const productOptions = JSON.parse(unParsedProductOptions);
    const isFeatured = JSON.parse(unParsedIsFeatured);
    const productImagesPublicIds = req.body.productImagesPublicIds
      ? Array.isArray(req.body.productImagesPublicIds)
        ? req.body.productImagesPublicIds
        : req.body.productImagesPublicIds.split(",")
      : [];
    let imageUrls: string[] = [];

    if (productImages && productImages?.length > 0) {
      if (Array.isArray(productImages)) {
        imageUrls = await cloudinary.uploadImages(productImages);
        uploadedImagePublicIds.push(...imageUrls);
      }
    }

    // Check if files were uploaded string
    if (productImagesPublicIds && Array.isArray(productImagesPublicIds)) {
      imageUrls = [...imageUrls, ...productImagesPublicIds];
    }

    // Create the main product
    const product = new ProductModel({
      name,
      description,
      productImages: imageUrls,
      slug,
      basePrice,
      category,
      stock,
      isFeatured,
      productSelectionStep,
      productOptions: [], // Will be populated later
    });

    await product.save({ session });

    // Create product options if provided
    if (productOptions && productOptions.length > 0) {
      let parsedOptions = productOptions;

      // Handle case where productOptions is a string (JSON)
      if (typeof productOptions === "string") {
        try {
          parsedOptions = JSON.parse(productOptions);
        } catch (e) {
          console.error("Error parsing productOptions:", e);
          parsedOptions = [];
        }
      }
      console.log(parsedOptions);

      const optionIds = await saveProductOptions(
        parsedOptions,
        product._id,
        session
      );

      // Update product with option references

      product.productOptions = optionIds;
      await product.save({ session });
    }

    await session.commitTransaction();

    // Fetch the complete product with populated options
    const populatedProduct = await ProductModel.findById(product._id)
      .populate("productOptions")
      .exec();

    res.status(201).json({
      success: true,
      data: populatedProduct,
      message: "Product created successfully",
    });

    redis.publish("product-created", null);

    return;
  } catch (error) {
    for (const publicId of uploadedImagePublicIds) {
      try {
        await cloudinary.deleteImage(publicId);
      } catch (deleteError) {
        console.error(
          "Failed to delete uploaded image:",
          publicId,
          deleteError
        );
      }
    }
    await session.abortTransaction();
    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      res.status(400).json({
        success: false,
        message: "A product with this slug already exists",
      });
      return;
    }

    next(error);
  } finally {
    session.endSession();
  }
};
