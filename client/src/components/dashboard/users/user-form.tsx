"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { FileUploader } from "../../ui/file-uploader";
import { formSchema } from "@/src/schemas";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/src/constants";
import { Link } from "react-router";

// Product Selection Types
const ProductSelectionTypes = {
  Color: "color",
  Storage: "storage",
  Size: "size",
  Model: "model",
  Material: "material",
  Design: "design",
};

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({
  initialData,
  pageTitle = "Create New Product",
}: {
  initialData?: Partial<FormValues> | null;
  pageTitle?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert option enum to array for dropdown
  const productSelectionOptions = Object.entries(ProductSelectionTypes).map(
    ([label, value]) => ({ label, value: value.toString() })
  );

  // Initialize form with default values
  const defaultValues: Partial<FormValues> = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    productImages: initialData?.productImages || [""],
    slug: initialData?.slug || "",
    basePrice: initialData?.basePrice || 99,
    category: initialData?.category || "phonecase",
    stock: initialData?.stock || 99,
    productSelectionStep: initialData?.productSelectionStep || [""],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      console.log(data);
      // Here you would call your API function, e.g.:
      // await createProduct(data);
      // toast.success("Product created successfully");
    } catch (error) {
      console.error("Error submitting product:", error);
      // toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper functions for array fields
  const addImageField = () => {
    const currentImages = form.getValues("productImages");
    if (currentImages.length < 5) {
      form.setValue("productImages", [...currentImages, ""]);
    }
  };

  const removeImageField = (index: number) => {
    const currentImages = form.getValues("productImages");
    if (currentImages.length > 2) {
      form.setValue(
        "productImages",
        currentImages.filter((_, i) => i !== index)
      );
    }
  };

  const addSelectionStep = () => {
    const currentSteps = form.getValues("productSelectionStep");
    form.setValue("productSelectionStep", [...currentSteps, ""]);
  };

  const removeSelectionStep = (index: number) => {
    const currentSteps = form.getValues("productSelectionStep");
    if (currentSteps.length > 1) {
      form.setValue(
        "productSelectionStep",
        currentSteps.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
        <CardDescription>
          Add a new product to your inventory. Fill in all required fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="iPhone 15 Pro" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the exact product name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="iphone-15-pro" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Base Price */}
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="iphone">iPhone</SelectItem>
                        <SelectItem value="macbook">MacBook</SelectItem>
                        <SelectItem value="apple_watch">Apple Watch</SelectItem>
                        <SelectItem value="ipad">iPad</SelectItem>
                        <SelectItem value="airpods">AirPods</SelectItem>
                        <SelectItem value="phonecase">Phone Case</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Product Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-base">Product Images</FormLabel>
                <FormDescription className="text-xs">
                  Upload 2-5 images (max 5MB each)
                </FormDescription>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageField}
                  disabled={form.watch("productImages").length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              <div className="space-y-4">
                {/* File uploader for multiple image files */}
                <FormField
                  control={form.control}
                  name="productImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          value={field.value.filter(
                            (item) => item instanceof File
                          )}
                          onValueChange={(files) => {
                            const urlImages = field.value.filter(
                              (item) => typeof item === "string"
                            );

                            field.onChange([...urlImages, ...files]);
                          }}
                          maxFiles={5}
                          maxSize={MAX_FILE_SIZE}
                          accept={ACCEPTED_IMAGE_TYPES}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL inputs for image URLs */}
                {form.watch("productImages").map((image, index) => {
                  // Skip file objects, only render inputs for string URLs
                  if (image instanceof File) return null;

                  return (
                    <div key={`image-url-${index}`} className="flex gap-3">
                      <FormField
                        control={form.control}
                        name={`productImages.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="flex">
                                <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  className="rounded-l-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImageField(index)}
                        disabled={form.watch("productImages").length <= 2}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Product Selection Steps */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-base">
                  Product Selection Steps
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSelectionStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {form.watch("productSelectionStep").map((_, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <FormField
                    control={form.control}
                    name={`productSelectionStep.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a step" />
                            </SelectTrigger>
                            <SelectContent>
                              {productSelectionOptions.map(
                                ({ label, value }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSelectionStep(index)}
                    disabled={form.watch("productSelectionStep").length <= 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}

              <FormDescription>
                Select steps that customers will follow when choosing product
                options (e.g., "Color", "Storage").
              </FormDescription>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link to={"/dashboard/product"}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : initialData
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
// TODO: done with user ,create, mocking and editing
