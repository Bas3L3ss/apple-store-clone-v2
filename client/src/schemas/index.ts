import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "../constants";

export const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .refine(
        (password) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            password
          );
        },
        {
          message:
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
// Schema for image validation that accepts both files and URLs
const imageSchema = z.union([
  z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  z.string(),
]);

// Updated form schema
export const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  productImages: z
    .array(imageSchema)
    .min(2, { message: "At least 2 product images are required" })
    .max(5, { message: "Maximum 5 product images allowed" }),
  slug: z.string().min(2, {
    message:
      "Slug must be at least 2 characters and be identical to url-formatted name",
  }),
  basePrice: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  category: z.enum(
    ["iphone", "macbook", "apple_watch", "ipad", "airpods", "phonecase"],
    {
      required_error: "Please select a category",
    }
  ),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
  productSelectionStep: z
    .array(z.string())
    .min(1, { message: "At least one selection step is required" }),
});
