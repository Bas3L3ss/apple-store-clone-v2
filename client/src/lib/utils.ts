import clsx, { ClassValue } from "clsx";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "../components/board-column";
import { twMerge } from "tailwind-merge";
import Axios from "axios";
import { OrderStatus, ProductOption, ShippingAddress } from "../@types";
import { colorHexMap } from "../constants/color";
import { BACKEND_URL } from "../constants";
import { TaskDragData } from "../components/dashboard/kanban/components/task-card";
import Bowser from "bowser";

export const axios = Axios.create({
  baseURL: BACKEND_URL ?? "http://localhost:5000",
});
export const makeAxiosRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: unknown,
  isFormData: boolean = false
): Promise<T> => {
  const token = sessionStorage.getItem("token");
  let deviceId: string | undefined;

  if (!token) {
    const deviceInfo = await getDeviceInfo();
    deviceId = deviceInfo?.deviceId;
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (!data || typeof data !== "object") {
    data = {};
  }

  if (deviceId) {
    if (!isFormData) {
      (data as Record<string, unknown>)!["deviceId"] = deviceId;
    } else if (isFormData && data instanceof FormData) {
      data.append("deviceId", deviceId);
    }
  }

  const config: Record<string, unknown> = { method, url, headers };

  if (method === "get") {
    config.params = data;
  } else {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    // @ts-expect-error: no prob
    throw error?.response?.data?.message || error.message;
  }
};

// other utils

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const checkIsNew = (createdAt: string | Date) => {
  //@ts-expect-error : i don't know how to deal with this problem tho it's working so i'll let it slide
  return new Date() - new Date(createdAt) < 30 * 24 * 60 * 60 * 1000;
};
export function formatDate(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export function formatEstimatedDelivery(estimatedDate: string) {
  const now = new Date();
  const deliveryDate = new Date(estimatedDate);

  // If the delivery date is in the past, fallback to dd/mm/yyyy format
  if (deliveryDate < now) {
    return deliveryDate.toLocaleDateString("en-GB"); // Format: dd/mm/yyyy
  }

  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  // @ts-expect-error: this is fine
  const diffInDays = Math.ceil((deliveryDate - now) / oneDay);

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === 2) return "Next 2 days";
  if (diffInDays <= 7) return "Next week";
  if (diffInDays <= 14) return "Next 2 weeks";
  if (diffInDays <= 30) return "Next month";

  return deliveryDate.toLocaleDateString("en-GB"); // Default fallback
}

export const getStatusProgress = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PREPARING:
      return 33;
    case OrderStatus.DELIVERING:
      return 66;
    case OrderStatus.FINISHED:
      return 100;
    default:
      return 0;
  }
};

// Function to get hex color
export const getColorHex = (color: string): string => {
  return colorHexMap[color] || color; // Default to black if not found
};
// Format address for display
export const formatAddress = (address: ShippingAddress) => {
  if (!address) return "";
  const { line1, line2, city, state, postalCode } = address;
  const line2Display = line2 ? `, ${line2}` : "";
  return `${line1}${line2Display}, ${city}, ${state} ${postalCode}`;
};

export const formatShippingAddress = (addressStr: string) => {
  if (!addressStr) return "No address provided";
  try {
    const address = JSON.parse(addressStr);
    return address.fullAddress || "No address provided";
  } catch {
    return "Into the moon!";
  }
};

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return "bg-amber-100 text-amber-800";
    case "delivering":
      return "bg-blue-100 text-blue-800";
    case "finished":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const calculateTimeSinceLastPurchase = (lastPurchaseDate: string) => {
  const now = new Date();
  const lastPurchase = new Date(lastPurchaseDate);
  const diffTime = Math.abs(now.getTime() - lastPurchase.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export const formatOption = (option: ProductOption) => {
  for (const key in option) {
    if (
      key !== "_id" &&
      key !== "productId" &&
      key !== "price" &&
      key !== "stock" &&
      key !== "__v" &&
      key !== "createdAt" &&
      key !== "updatedAt"
    ) {
      return {
        type: key,
        //@ts-expect-error: no prob
        value: key === "color" ? getColorHex(option[key]) : option[key],
      };
    }
  }
  return { type: "", value: "" };
};
export const getPlaceholder = (type: string) => {
  switch (type) {
    case "color":
      return "e.g., Space Black, Silver, Gold";
    case "storage":
      return "e.g., 128GB, 256GB, 512GB";
    case "size":
      return "e.g., Small, Medium, Large";
    case "material":
      return "e.g., Aluminum, Stainless Steel";
    case "processor":
      return "e.g., M1, M2 Pro, M2 Max";
    case "accessories":
      return "e.g., Case, Screen Protector";
    case "carrier":
      return "e.g., Unlocked, AT&T, Verizon";
    default:
      return "Enter value...";
  }
};

export async function getDeviceInfo() {
  const sessionId = localStorage.getItem("sessionToken");
  const response = await fetch("https://api64.ipify.org?format=json");
  const parsedRes = await response.json();

  const browser = Bowser.getParser(window.navigator.userAgent);

  const os = browser.getOSName() || "Unknown OS";
  const deviceType = browser.getPlatformType() || "Unknown";
  const ip = parsedRes.ip;
  const name = browser.getBrowserName() || "Unknown Browser";

  const sanitizedDeviceType = deviceType.replace(/:/g, "");
  const sanitizedOs = os.replace(/:/g, "");
  const sanitizedName = name.replace(/:/g, "");
  const sanitizedIp = ip.replace(/:/g, "");

  const newDeviceId = `${sanitizedDeviceType}-${sanitizedOs}-${sanitizedName}-${sanitizedIp}`;

  return {
    deviceId: sessionId ? `${newDeviceId}:${sessionId}` : newDeviceId,
    device: {
      deviceType,
      os,
      name,
      ip,
    },
  };
}
