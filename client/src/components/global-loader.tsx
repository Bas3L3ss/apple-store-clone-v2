import { motion } from "framer-motion";
import LoadingState from "./loading";

const GlobalLoader = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingState />
    </motion.div>
  );
};

export default GlobalLoader;
