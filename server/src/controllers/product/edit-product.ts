import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ProductModel } from "../../models/Product";
import { ProductOptionModel } from "../../models/ProductOptions";
import { saveProductOptions } from "./utils";
import cloudinary from "../../utils/cloudinary";

export const EditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { _id } = req.body;

    if (!_id) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
      return;
    }

    const existingProduct = await ProductModel.findById(_id);
    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    const {
      name,
      description,
      productImages,
      slug,
      basePrice,
      category,
      stock,
      isFeatured,
      productSelectionStep,
      productOptions,
    } = req.body;

    // Process and upload new images
    let newImageUrls: string[] = [];
    if (productImages && productImages.length > 0) {
      if (Array.isArray(productImages)) {
        newImageUrls = await cloudinary.uploadImages(productImages);
      }
    }

    // Check if files were uploaded via multer (req.files)
    if (req.files && Array.isArray(req.files)) {
      const uploadedFiles = req.files.map((file: any) => file.path);
      newImageUrls = [...newImageUrls, ...uploadedFiles];
    }

    // Handle image cleanup - identify and delete unused images
    const existingImages = existingProduct.productImages || [];
    const finalImageUrls =
      newImageUrls.length > 0 ? newImageUrls : existingImages;

    // Find images that were removed and should be deleted from Cloudinary
    const imagesToDelete = existingImages.filter(
      (existingImageUrl) => !finalImageUrls.includes(existingImageUrl)
    );

    // Delete unused images from Cloudinary
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map(async (imageUrl) => {
          try {
            // Extract public ID from Cloudinary URL
            // Example: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image-id.jpg
            const urlParts = imageUrl.split("/");
            const filenameWithExtension = urlParts[urlParts.length - 1];
            const publicId = filenameWithExtension.split(".")[0];

            // If the image is in a folder, we need to include the folder name in the public ID
            const folderIndex = urlParts.indexOf("upload") + 1;
            if (folderIndex < urlParts.length - 1) {
              const folderPath = urlParts
                .slice(folderIndex, urlParts.length - 1)
                .join("/");
              const fullPublicId = `${folderPath}/${publicId}`;
              await cloudinary.deleteImage(fullPublicId);
              console.log(`✅ Deleted unused image: ${fullPublicId}`);
            } else {
              await cloudinary.deleteImage(publicId);
              console.log(`✅ Deleted unused image: ${publicId}`);
            }
          } catch (error) {
            console.error(`❌ Failed to delete image ${imageUrl}:`, error);
            // Continue with other deletions even if one fails
          }
        })
      );
    }

    // Update main product fields
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.productImages = finalImageUrls;
    existingProduct.slug = slug;
    existingProduct.basePrice = basePrice;
    existingProduct.category = category;
    existingProduct.stock = stock;
    existingProduct.isFeatured = isFeatured;
    existingProduct.productSelectionStep = productSelectionStep;

    await existingProduct.save({ session });

    // Handle product options
    if (productOptions) {
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

      // Delete existing options that are not in the new options list
      const existingOptionIds = existingProduct.productOptions.map((id) =>
        id.toString()
      );
      const keepOptionIds = parsedOptions
        .filter((option) => option._id && !option._id.startsWith("temp-id-"))
        .map((option) => option._id.toString());

      const optionsToDelete = existingOptionIds.filter(
        (id) => !keepOptionIds.includes(id)
      );

      if (optionsToDelete.length > 0) {
        await ProductOptionModel.deleteMany(
          {
            _id: { $in: optionsToDelete },
            productId: existingProduct._id,
          },
          { session }
        );
      }

      // Update existing options and create new ones
      const updatedOptionIds = await saveProductOptions(
        parsedOptions,
        existingProduct._id,
        session
      );

      existingProduct.productOptions = updatedOptionIds;
      await existingProduct.save({ session });
    }

    await session.commitTransaction();

    // Fetch the updated product with populated options
    const updatedProduct = await ProductModel.findById(existingProduct._id)
      .populate("productOptions")
      .exec();

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
    return;
  } catch (error) {
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
