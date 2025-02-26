import { motion } from "framer-motion";

const ProductCard = () => {
  const product = {
    name: "iPhone 16e Silicone Case – Fuchsia",
    price: "$39.00",
    image: "/placeholder.svg", // Replace with actual product image
    colors: ["#4a4f46", "#5f5f5f", "#d5a9d8", "#f3057d", "#282828"], // Example colors
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-[300px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
    >
      {/* Product Image */}
      <div className="w-[200px] h-[250px] flex justify-center items-center bg-gray-100 rounded-xl">
        <img src={product.image} alt={product.name} className="object-cover" />
      </div>

      {/* Color Options */}
      <div className="flex gap-2 my-3">
        {product.colors.map((color, index) => (
          <span
            key={index}
            className="w-3.5 h-3.5 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Product Details */}
      <div className="w-full text-left">
        <p className="text-orange-600 text-sm font-bold mb-1">New</p>
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-lg font-medium">{product.price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
