import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// Define user roles
const UserRoles = {
  User: "user",
  Admin: "admin",
};

// Create schema for form validation
const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string(),
  verified: z.boolean(),
  avatar: z.any().optional(), // Can be a File object or a string URL
});

type UserFormValues = z.infer<typeof userFormSchema>;

const useUserForm = ({ initialData }: { initialData: any | null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert role enum to array for dropdown
  const userRoleOptions = Object.entries(UserRoles).map(([label, value]) => ({
    label,
    value: value.toString(),
  }));

  // Initialize form with default values from initialData
  const defaultValues: Partial<UserFormValues> = {
    username: initialData?.username || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
    verified: initialData?.verified || false,
    avatar: initialData?.avatar || "",
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    try {
      console.log("Edit user data:", data);
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to edit user");
    } finally {
      setIsSubmitting(false);
    }
  }
  return { form, onSubmit, isSubmitting, userRoleOptions };
};

export default useUserForm;
