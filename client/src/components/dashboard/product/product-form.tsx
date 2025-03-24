"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, Upload, Edit } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { toast } from "sonner";
import { Switch } from "@/src/components/ui/switch";
import { formatPrice, getColorHex } from "@/src/lib/utils";
import { createProduct } from "@/src/action/products";

// Product Selection Types
const ProductSelectionTypes = {
  Color: "color",
  Storage: "storage",
  Size: "size",
  Model: "model",
  Material: "material",
  Design: "design",
};

// Option Types for creating product options
const optionTypes = [
  { value: "color", label: "Color" },
  { value: "storage", label: "Storage" },
  { value: "size", label: "Size" },
  { value: "material", label: "Material" },
  { value: "processor", label: "Processor" },
  { value: "accessories", label: "Accessories" },
  { value: "carrier", label: "Carrier" },
];

// Extended form schema to include product options
const extendedFormSchema = formSchema.extend({
  isFeatured: z.boolean().default(false),
  productOptions: z
    .array(
      z.object({
        _id: z.string().optional(),
        productId: z.string().optional(),
        optionType: z.string().optional(),
        optionValue: z.string().optional(),
        price: z.number().positive(),
        stock: z.number().int().nonnegative(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      })
    )
    .optional(),
});

export type FormValues = z.infer<typeof extendedFormSchema>;

// Helper function to format option type and value for display
const formatOption = (option) => {
  for (const key in option) {
    if (
      key !== "_id" &&
      key !== "productId" &&
      key !== "price" &&
      key !== "stock" &&
      key !== "__v" &&
      key !== "createdAt" &&
      key !== "updatedAt"
    ) {
      return {
        type: key,
        value: key === "color" ? getColorHex(option[key]) : option[key],
      };
    }
  }
  return { type: "", value: "" };
};

export default function ProductForm({
  initialData,
  pageTitle = "Create New Product",
}: {
  initialData?: Partial<FormValues> | null;
  pageTitle?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );

  // Initialize product options from initial data
  const initialOptions = initialData?.productOptions || [];

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
    isFeatured: initialData?.isFeatured || false,
    productSelectionStep: initialData?.productSelectionStep || [""],
    productOptions: initialOptions,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(extendedFormSchema),
    defaultValues,
  });

  // Form for product options
  const optionForm = useForm({
    resolver: zodResolver(
      z.object({
        _id: z.string().optional(),
        optionType: z.string({
          required_error: "Please select an option type",
        }),
        optionValue: z.string().min(1, {
          message: "Please enter a value for the selected option",
        }),
        price: z.coerce
          .number()
          .positive({ message: "Price must be a positive number" }),
        stock: z.coerce
          .number()
          .int()
          .nonnegative({ message: "Stock must be a non-negative integer" }),
      })
    ),
    defaultValues: {
      _id: "",
      optionType: "",
      optionValue: "",
      price: 0,
      stock: 0,
    },
  });

  // Handle option dialog opening for edit
  const handleEditOption = (index: number) => {
    const options = form.getValues("productOptions") || [];
    const option = options[index];
    if (!option) return;

    const { type, value } = formatOption(option);

    optionForm.reset({
      _id: option._id || "",
      optionType: type,
      optionValue: value,
      price: option.price,
      stock: option.stock,
    });

    setEditingOptionIndex(index);
    setIsOptionDialogOpen(true);
  };

  // Handle option dialog opening for create
  const handleAddOption = () => {
    optionForm.reset({
      _id: "",
      optionType: "",
      optionValue: "",
      price: form.getValues("basePrice") || 0,
      stock: 0,
    });
    setEditingOptionIndex(null);
    setIsOptionDialogOpen(true);
  };

  // Handle save option
  const handleSaveOption = (data) => {
    const currentOptions = form.getValues("productOptions") || [];
    const newOption = {
      _id: data._id || `temp-id-${Date.now()}`,
      productId: initialData?._id || "",
      [data.optionType]: data.optionValue,
      price: data.price,
      stock: data.stock,
    };

    if (editingOptionIndex !== null) {
      // Edit existing option
      const updatedOptions = [...currentOptions];
      updatedOptions[editingOptionIndex] = newOption;
      form.setValue("productOptions", updatedOptions);
    } else {
      // Add new option
      form.setValue("productOptions", [...currentOptions, newOption]);
    }

    setIsOptionDialogOpen(false);
    toast.success(
      `Product option ${
        editingOptionIndex !== null ? "updated" : "added"
      } successfully`
    );
  };

  // Handle delete option
  const handleDeleteOption = (index: number) => {
    const currentOptions = form.getValues("productOptions") || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue("productOptions", updatedOptions);
    toast.success("Product option removed");
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      console.log(data);
      if (initialData) {
        // await editProduct(data);
      } else {
        await createProduct(data);
      }
      toast.success(
        `Product ${initialData ? "updated" : "created"} successfully`
      );
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(`Failed to ${initialData ? "update" : "create"} product`);
    } finally {
      setIsSubmitting(false);
    }
  }

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

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "color":
        return "e.g., Space Black, Silver, Gold";
      case "storage":
        return "e.g., 128GB, 256GB, 512GB";
      case "size":
        return "e.g., Small, Medium, Large";
      case "material":
        return "e.g., Aluminum, Stainless Steel";
      case "processor":
        return "e.g., M1, M2 Pro, M2 Max";
      case "accessories":
        return "e.g., Case, Screen Protector";
      case "carrier":
        return "e.g., Unlocked, AT&T, Verizon";
      default:
        return "Enter value...";
    }
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {pageTitle}
          </CardTitle>
          <CardDescription>
            {initialData
              ? "Edit product details and options"
              : "Add a new product to your inventory. Fill in all required fields."}
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
                        <Input
                          placeholder="iphone-15-pro"
                          value={form.watch("name")}
                          {...field}
                        />
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
                          <SelectItem value="apple_watch">
                            Apple Watch
                          </SelectItem>
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
              {/* Featured Product Switch */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormLabel className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <p>Featured Product</p>
                      <FormDescription>
                        Display this product on the featured section of the
                        homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormLabel>
                )}
              />
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
              <Separator />
              {/* Product Options Management */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Product Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage variations of this product (colors, materials,
                      etc.)
                    </p>
                  </div>
                  <Button type="button" onClick={handleAddOption} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {form.watch("productOptions")?.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Price ($)</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {form.watch("productOptions").map((option, index) => {
                          const { type, value } = formatOption(option);
                          return (
                            <TableRow key={option._id || index}>
                              <TableCell className="font-medium capitalize">
                                {type}
                              </TableCell>
                              <TableCell>
                                {type === "color" ? (
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full border"
                                      style={{ backgroundColor: value }}
                                    />
                                    {value}
                                  </div>
                                ) : (
                                  value
                                )}
                              </TableCell>
                              <TableCell>{formatPrice(option.price)}</TableCell>
                              <TableCell>{option.stock}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditOption(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteOption(index)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="border rounded-md p-8 text-center">
                    <p className="text-muted-foreground">
                      No options added yet
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={handleAddOption}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Option
                    </Button>
                  </div>
                )}
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

      {/* Product Option Dialog */}
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOptionIndex !== null
                ? "Edit Option"
                : "Add Product Option"}
            </DialogTitle>
            <DialogDescription>
              {editingOptionIndex !== null
                ? "Update the details for this product option"
                : "Create a new option for this product"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={optionForm.handleSubmit(handleSaveOption)}
            className="space-y-6"
          >
            {/* Option Type Selection */}
            <div className="grid w-full gap-1.5">
              <label htmlFor="optionType" className="text-sm font-medium">
                Option Type
              </label>
              <Select
                value={optionForm.watch("optionType")}
                onValueChange={(value) =>
                  optionForm.setValue("optionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option type" />
                </SelectTrigger>
                <SelectContent>
                  {optionTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {optionForm.formState.errors.optionType && (
                <p className="text-sm text-destructive">
                  {optionForm.formState.errors.optionType.message}
                </p>
              )}
            </div>

            {/* Option Value */}
            <div className="grid w-full gap-1.5">
              <label htmlFor="optionValue" className="text-sm font-medium">
                Option Value
              </label>
              <Input
                id="optionValue"
                type={
                  optionForm.watch("optionType") === "color" ? "color" : "text"
                }
                placeholder={getPlaceholder(
                  optionForm.watch("optionType") || ""
                )}
                value={optionForm.watch("optionValue")}
                onChange={(e) =>
                  optionForm.setValue("optionValue", e.target.value)
                }
                className="col-span-3"
              />
              {optionForm.formState.errors.optionValue && (
                <p className="text-sm text-destructive">
                  {optionForm.formState.errors.optionValue.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="grid w-full gap-1.5">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={optionForm.watch("price")}
                  onChange={(e) =>
                    optionForm.setValue("price", parseFloat(e.target.value))
                  }
                />
                {optionForm.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {optionForm.formState.errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="grid w-full gap-1.5">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={optionForm.watch("stock")}
                  onChange={(e) =>
                    optionForm.setValue("stock", parseInt(e.target.value))
                  }
                />
                {optionForm.formState.errors.stock && (
                  <p className="text-sm text-destructive">
                    {optionForm.formState.errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOptionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingOptionIndex !== null ? "Update Option" : "Add Option"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
