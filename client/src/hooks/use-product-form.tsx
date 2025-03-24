import { useCallback, useMemo, useState } from "react";
import { ProductSelectionTypes } from "../constants/product-form";
import { FormValues } from "../components/dashboard/product/product-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatOption } from "../lib/utils";
import { toast } from "sonner";
import { extendedFormSchema } from "../schemas";
import { createProduct } from "../action/products";

const useProductForm = ({
  initialData,
}: {
  initialData: Partial<FormValues> | null;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );

  const initialOptions = initialData?.productOptions || [];

  const productSelectionOptions = useMemo(
    () =>
      Object.entries(ProductSelectionTypes).map(([label, value]) => ({
        label,
        value: value.toString(),
      })),
    []
  );

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
  const handleSaveOption = useCallback(
    (data) => {
      const currentOptions = form.getValues("productOptions") || [];
      console.log(currentOptions);

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
    },
    [form, editingOptionIndex, initialData]
  );

  // Handle delete option
  const handleDeleteOption = useCallback(
    (index: number) => {
      const currentOptions = form.getValues("productOptions") || [];
      const updatedOptions = currentOptions.filter((_, i) => i !== index);
      form.setValue("productOptions", updatedOptions);
      toast.success("Product option removed");
    },
    [form]
  );

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      data.productOptions = form.getValues("productOptions");
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

  return {
    ProductSelectionTypes,
    addImageField,
    addSelectionStep,
    defaultValues,
    editingOptionIndex,
    form,
    formatOption,
    handleAddOption,
    handleDeleteOption,
    handleEditOption,
    handleSaveOption,
    initialOptions,
    isOptionDialogOpen,
    isSubmitting,
    productSelectionOptions,
    onSubmit,
    removeImageField,
    removeSelectionStep,
    setIsOptionDialogOpen,
    optionForm,
  };
};

export default useProductForm;
