"use client";

import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { searchProducts } from "@/src/lib/mockData";
import { ProductCategory } from "@/src/lib/types";

export default function RecommendationCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const productsByCategory = searchProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<number, typeof searchProducts>);

  const categories = [
    { id: ProductCategory.Iphone, name: "iPhone" },
    { id: ProductCategory.Macbook, name: "MacBook" },
    { id: ProductCategory.Ipad, name: "iPad" },
    { id: ProductCategory.AppleWatch, name: "Apple Watch" },
    { id: ProductCategory.AirPod, name: "AirPods" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8;

      if (direction === "left") {
        carouselRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
      } else {
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
        setScrollPosition(
          Math.min(scrollWidth - clientWidth, scrollPosition + scrollAmount)
        );
      }
    }
  };

  return (
    <div className="  mx-auto relative">
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 shadow-md h-10 w-10"
          onClick={() => scroll("left")}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto no-scrollbar gap-6 pb-4 pt-2 px-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {[...categories, ...categories, ...categories].map((category) =>
          productsByCategory[category.id]?.slice(0, 1).map((product, index) => (
            <motion.div
              key={`product.id ${index}`}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden shadow-md"
            >
              <div className="relative h-[200px] bg-gray-100">
                <img
                  src={product.productImages[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-medium text-gray-900">
                  ${product.basePrice}
                </p>
                <Button className="w-full mt-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 shadow-md h-10 w-10"
          onClick={() => scroll("right")}
          disabled={
            scrollPosition >=
            (carouselRef.current?.scrollWidth || 0) -
              (carouselRef.current?.clientWidth || 0)
          }
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
