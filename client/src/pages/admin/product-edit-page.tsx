import { useGetProductById } from "@/src/react-query-hooks/use-get-product-by-id";
import FormCardSkeleton from "@/src/components/dashboard/ui/form-card-skeleton"; // Import the loading component
import ProductForm from "@/src/components/dashboard/product/product-form";
import { useParams } from "react-router";

export default function ProductEditPage() {
  const { id } = useParams();
  const { data, isError, isLoading } = useGetProductById(id ?? "");

  const pageTitle = "Edit Product";

  if (isLoading) {
    return <FormCardSkeleton />; // Show loading skeleton while data is being fetched
  }

  if (isError) {
    return <div>Error loading product. Please try again later.</div>; // Handle error case
  }

  return <ProductForm initialData={data} pageTitle={pageTitle} />; // Use 'data' for initialData
}
