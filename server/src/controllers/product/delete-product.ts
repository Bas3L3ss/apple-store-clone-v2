import { Request, Response } from "express";
import { ProductModel } from "../../models/Product";
import cloudinary from "../../utils/cloudinary";
import redis from "../../utils/redis";

export const deleteProducts = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      res.status(400).json({ error: "Invalid productIds array" });
      return;
    }

    // Fetch products to get their image URLs
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Extract public IDs from Cloudinary URLs
    const imagePublicIds = products.flatMap((product) =>
      product.productImages.map(
        (url) =>
          url
            .split("/upload/v")[1]
            ?.split("/")
            ?.slice(1)
            ?.join("/")
            ?.split(".")[0]
      )
    );

    // Delete images from Cloudinary
    if (imagePublicIds.some((id) => id)) {
      await Promise.all(
        imagePublicIds
          .filter((id) => id)
          .map((id) => cloudinary.deleteImage(id))
      );
    }

    // Delete products
    await ProductModel.deleteMany({ _id: { $in: productIds } });

    redis.publish("product-deleted", {});
    res.json({ success: true, message: "Products deleted successfully" });
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ error: "Failed to delete products" });
  }
};
