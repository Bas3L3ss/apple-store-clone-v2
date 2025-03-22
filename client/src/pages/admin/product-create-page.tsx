import ProductForm from "@/src/components/dashboard/product/product-form";

export default function ProductCreatePage() {
  const pageTitle = "Create Product";

  return <ProductForm initialData={undefined} pageTitle={pageTitle} />; // Use 'data' for initialData
}
