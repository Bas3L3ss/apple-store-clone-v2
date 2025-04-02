const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const WEBSOCKET_URL =
  import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001";

export { BACKEND_URL, WEBSOCKET_URL };

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};
