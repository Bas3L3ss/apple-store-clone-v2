import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../constants/index";

class CloudinaryClient {
  private isConfigured: boolean = false;
  private defaultFolder: string = "product-images";
  private defaultAllowedFormats: string[] = ["jpg", "jpeg", "png", "webp"];
  private defaultFileSize: number = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.configureCloudinary();
  }

  private configureCloudinary(): void {
    try {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
      });

      this.isConfigured = true;
      console.log("✅ Cloudinary configured");
    } catch (error: unknown) {
      // @ts-expect-error:no prob
      console.log("❌ Cloudinary configuration error:", error.message);
      this.isConfigured = false;
      throw error;
    }
  }

  createUploadMiddleware(options?: {
    folder?: string;
    allowedFormats?: string[];
    fileSize?: number;
    transformation?: Array<Record<string, any>>;
  }) {
    if (!this.isConfigured) {
      throw new Error("Cloudinary is not configured");
    }

    const folder = options?.folder || this.defaultFolder;
    const allowedFormats =
      options?.allowedFormats || this.defaultAllowedFormats;
    const fileSize = options?.fileSize || this.defaultFileSize;
    const transformation = options?.transformation || [
      { width: 1000, height: 1000, crop: "limit" },
    ];

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: allowedFormats,
        transformation: transformation,
      },
    });

    const fileFilter = (
      req: any,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      const filetypeRegex = new RegExp(allowedFormats.join("|"));
      const mimetype = filetypeRegex.test(file.mimetype);
      const extname = filetypeRegex.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(new Error(`Only ${allowedFormats.join(", ")} formats allowed!`));
    };

    return multer({
      storage: storage,
      limits: { fileSize: fileSize },
      fileFilter: fileFilter,
    });
  }

  async uploadImages(
    images: any[],
    folder?: string,
    returnUrl: boolean = false
  ): Promise<string[]> {
    if (!this.isConfigured) {
      throw new Error("Cloudinary is not configured");
    }

    const uploadFolder = folder || this.defaultFolder;
    const uploadedImageUrls: string[] = [];

    for (const image of images) {
      try {
        if (typeof image === "string") {
          uploadedImageUrls.push(image);
          continue;
        }

        if (image.buffer) {
          const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: uploadFolder },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );

            uploadStream.end(image.buffer);
          });

          console.log(result);

          uploadedImageUrls.push(
            !returnUrl ? result.public_id : result.secure_url
          );

          continue;
        }

        console.warn("Skipping unknown image format:", image);
      } catch (error: any) {
        console.log("❌ Error uploading image to Cloudinary:", error.message);
        return [];
      }
    }

    return uploadedImageUrls;
  }

  async deleteImage(publicId: string): Promise<any> {
    if (publicId.length <= 0) return;
    if (!this.isConfigured) {
      throw new Error("Cloudinary is not configured");
    }

    try {
      await cloudinary.uploader.destroy(publicId);
      console.log("removed image", publicId);
    } catch (error: unknown) {
      // @ts-expect-error:no prob
      console.log("❌ Error deleting image from Cloudinary:", error.message);
      throw error;
    }
  }

  generateUrl(publicId: string, options?: Record<string, any>): string {
    if (!this.isConfigured) {
      throw new Error("Cloudinary is not configured");
    }

    try {
      return cloudinary.url(publicId, options);
    } catch (error: unknown) {
      // @ts-expect-error:no prob
      console.log("❌ Error generating Cloudinary URL:", error.message);
      throw error;
    }
  }
}

export default new CloudinaryClient();
