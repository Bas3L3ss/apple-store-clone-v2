import CategoryNav from "../components/product/category-nav";
import FeaturedProduct from "../components/product/featured-product";
import ProductGrid from "../components/product/product-grid";
import RecommendationCarousel from "../components/product/recommendation";
import { ProductCategory } from "../lib/types";

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <FeaturedProduct
          // @ts-expect-error
          product={{
            id: "iphone-15-pro",
            name: "iPhone 15 Pro",
            description: "Titan. Siêu bền. Siêu nhẹ.",
            basePrice: 999,
            category: ProductCategory.Iphone,
            productImages: ["/api/placeholder/1200/600"],
          }}
        />
      </section>

      <section className="py-8 px-4 md:px-6 lg:px-8 border-b border-gray-200">
        <CategoryNav />
      </section>

      <section className="py-12 px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          All Products
        </h2>
        <ProductGrid />
      </section>

      {/* Recommendation Carousel */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          You May Also Like
        </h2>
        <RecommendationCarousel />
      </section>
    </div>
  );
};

export default ShopPage;
