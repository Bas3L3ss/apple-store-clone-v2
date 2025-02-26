import ProductCard from "./product-card";
import { motion } from "framer-motion";
import { searchProducts } from "@/src/lib/mockData";
import { useSearchParams } from "react-router";

export default function ProductGrid() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || null;

  const filteredProducts =
    category !== null
      ? searchProducts.filter((product) => product.category === category)
      : searchProducts;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          <>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </>
        ) : (
          <p className=" text-muted-foreground text-sm">No products found .</p>
        )}
      </div>
    </div>
  );
}
