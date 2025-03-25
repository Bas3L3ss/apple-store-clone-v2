import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EditAccountAdmin } from "../action/auth";
import { userFormSchema } from "../schemas";
// Define user roles
const UserRoles = {
  User: "user",
  Admin: "admin",
};

export type UserFormValues = z.infer<typeof userFormSchema>;

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
      await EditAccountAdmin({ newUserData: data, uid: initialData._id });
      toast.success("Edited User");
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to edit user");
    }
    setIsSubmitting(false);
  }
  return { form, onSubmit, isSubmitting, userRoleOptions };
};

export default useUserForm;
