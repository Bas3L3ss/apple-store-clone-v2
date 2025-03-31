import { cld } from "@/src/lib/cld";
import { cn } from "@/src/lib/utils";

const CloudinaryImage = ({
  publicId,
  //@ts-expect-error:no problem
  width = 500,
  //@ts-expect-error:no problem
  height = 500,
  className,
  alt,
}: {
  width?: number;
  height?: number;
  publicId: string;
  className?: string;
  alt?: string;
}) => {
  const img = cld.image(publicId).format("auto").quality("auto");
  const url = img.toURL();
  return (
    <img
      onError={(e) => {
        e.currentTarget.src = "/favicon.ico";
        e.currentTarget.width = 50;
        e.currentTarget.height = 50;
      }}
      className={cn(className, "select-none")}
      alt={alt ?? ""}
      src={url}
    />
  );
};

export default CloudinaryImage;
