import FormCardSkeleton from "@/src/components/dashboard/ui/form-card-skeleton";
import { Navigate, useParams } from "react-router";
import UserForm from "@/src/components/dashboard/users/user-form";
import { useGetUserById } from "@/src/react-query-hooks/admin/use-get-user-by-id";

export default function UserEditPage() {
  const { id } = useParams();
  const { data, isError, isLoading, error } = useGetUserById({ userId: id! });

  if (!id) {
    return <Navigate to={"/dashboard/user"} />;
  }

  if (isLoading) {
    return <FormCardSkeleton />; // Show loading skeleton while data is being fetched
  }

  if (isError || !data) {
    console.log("error?", error);

    return <div>User not found</div>;
  }

  return <UserForm initialData={data[0] ?? data} pageTitle={"Edit User"} />;
}
